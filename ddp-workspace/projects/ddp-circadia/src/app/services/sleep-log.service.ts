import { Inject, Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, concatMap, filter, take, tap } from 'rxjs/operators';

import {
  AnnouncementMessage,
  AnnouncementsServiceAgent,
  Auth0AdapterService,
  ConfigurationService,
  LoggingService,
  SessionMementoService,
} from 'ddp-sdk';

import { HttpMethod } from '../constants/http-method';
import { SleepLogCode, UtilitySleepLogCode } from '../constants/sleep-log-code';
import { GetUserInfoPayload } from '../interfaces/GetUserInfoPayload';
import { UserInfoResponse } from '../interfaces/UserInfoResponse';
import { CreateUserPayload } from '../interfaces/CreateUserPayload';
import { CreateUserResponse } from '../interfaces/CreateUserResponse';
import { CommonSleepLogProxyPayload } from '../interfaces/CommonSleepLogProxyPayload';

declare const DDP_ENV: Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class SleepLogService {
  private static readonly CONNECTOR_URL: string = DDP_ENV.sleepLogConnectorUrl;
  private static readonly SLEEP_LOG_CODES: string[] =
    Object.values(SleepLogCode);
  private static readonly LOG_SOURCE = 'SleepLogService';
  private static readonly WEEK_MS = 6.048e8;
  private static readonly SLEEP_LOG_DURATION_MULTIPLIER = 6;
  private static readonly DATE_FORMAT = 'yyyy-MM-dd';
  diaryUrl$ = new BehaviorSubject<string | null>(null);
  private userEmail: string | null = null;
  private initialized$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private sessionService: SessionMementoService,
    private auth0Service: Auth0AdapterService,
    private loggingService: LoggingService,
    private announcementsService: AnnouncementsServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {
    this.sessionService.sessionObservable
      .pipe(
        filter(session => !!session && !!session.accessToken),
        tap(({ accessToken }) =>
          this.auth0Service.webAuth.client.userInfo(
            accessToken,
            (err, user) => {
              if (err) {
                this.loggingService.logError(
                  SleepLogService.LOG_SOURCE,
                  'Error occured when tried to fetch user info',
                  err,
                );

                return;
              }

              this.userEmail = user.name;
              this.initialized$.next(true);
            },
          ),
        ),
        take(1),
      )
      .subscribe();
  }

  extractSleepLogAnnouncements(
    announcements: AnnouncementMessage[],
  ): SleepLogCode[] {
    const sleepLogAnnouncements: SleepLogCode[] = [];

    announcements.forEach(announcement => {
      if (SleepLogService.SLEEP_LOG_CODES.includes(announcement.message)) {
        sleepLogAnnouncements.push(announcement.message as SleepLogCode);
      }
    });

    return sleepLogAnnouncements;
  }

  runSleepLogActions(
    codes: SleepLogCode[],
    hasSleepLogActivity: boolean,
  ): Observable<CreateUserResponse | UserInfoResponse | null> {
    let actions: (SleepLogCode | UtilitySleepLogCode)[] = [];

    if (!codes.length) {
      if (hasSleepLogActivity) {
        actions = [UtilitySleepLogCode.GetInfo];
      }
    } else if (!codes.includes(SleepLogCode.CreateUser)) {
      actions = [...actions, UtilitySleepLogCode.GetInfo];
    } else {
      actions = codes;
    }

    return this.initialized$.pipe(
      filter(Boolean),
      take(1),
      concatMap(() => from(actions)),
      concatMap(action => this.createSleepLogAction(action)),
    );
  }

  private createSleepLogAction(
    code: SleepLogCode | UtilitySleepLogCode,
  ): Observable<any> {
    switch (code) {
      case SleepLogCode.CreateUser:
        return this.createUser();
      case UtilitySleepLogCode.GetInfo:
        return this.getUserInfo();
      default:
        return of(null);
    }
  }

  private createUser(): Observable<CreateUserResponse | null> {
    const payload: CreateUserPayload = {
      ...this.getCommonProxyPayload(HttpMethod.Post),
      start: this.datePipe.transform(Date.now(), SleepLogService.DATE_FORMAT),
      end: this.datePipe.transform(
        Date.now() +
          SleepLogService.SLEEP_LOG_DURATION_MULTIPLIER *
            SleepLogService.WEEK_MS,
        SleepLogService.DATE_FORMAT,
      ),
      email: this.userEmail,
    };

    return this.http
      .post<CreateUserResponse>(SleepLogService.CONNECTOR_URL, payload)
      .pipe(
        tap(data => this.diaryUrl$.next(data.diary_url)),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 409) {
            // Account already exists for some reason
            this.loggingService.logError(
              SleepLogService.LOG_SOURCE,
              'An account with this email already exists!',
            );
          } else {
            // Unknown error
            this.loggingService.logError(
              SleepLogService.LOG_SOURCE,
              'Unknown error during user registration in sleep log',
              err,
            );
          }

          return of(null);
        }),
      );
  }

  private getUserInfo(): Observable<UserInfoResponse | null> {
    const payload: GetUserInfoPayload = {
      ...this.getCommonProxyPayload(HttpMethod.Get),
      email: this.userEmail,
    };

    return this.http
      .post<UserInfoResponse>(SleepLogService.CONNECTOR_URL, payload)
      .pipe(
        tap(data => {
          this.diaryUrl$.next(data.diary_url);
        }),
        catchError(() => of(null)),
      );
  }

  private getCommonProxyPayload(
    method: HttpMethod,
    url = 'api/user/',
  ): CommonSleepLogProxyPayload {
    return {
      auth0Domain: this.config.auth0Domain,
      auth0ClientId: this.config.auth0ClientId,
      url,
      method,
    };
  }
}
