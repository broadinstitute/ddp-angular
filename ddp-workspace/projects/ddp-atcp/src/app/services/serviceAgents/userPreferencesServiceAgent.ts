import { Observable, of, throwError } from 'rxjs';
import { Injectable, Inject, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  LoggingService,
  ConfigurationService,
  UserProfile,
  SessionMementoService,
  UserProfileDecorator,
  LanguageService,
  UserServiceAgent
} from 'ddp-sdk';
import { catchError, filter, first, map } from 'rxjs/operators';


@Injectable()
export class UserPreferencesServiceAgent extends UserServiceAgent<UserProfile> {
  private log: LoggingService;
  private readonly LOGGER_SOURCE = 'UserPreferencesServiceAgent';

  constructor(
    session: SessionMementoService,
    @Inject('ddp.config') configuration: ConfigurationService,
    http: HttpClient,
    logger: LoggingService,
    _language: LanguageService,
    injector: Injector) {
    super(session, configuration, http, logger, _language);
    this.log = injector.get(LoggingService);
  }

  public get profile(): Observable<UserProfileDecorator> {
    return this.getObservable('/profile', {}, [400]).pipe(
      map(x => {
        if (x === null) {
          return null;
        }
        return new UserProfileDecorator(x);
      }),
      filter((data: UserProfileDecorator) => !!data && !!data.profile),
      first(null, null),
      catchError(e => {
        if (e.error && e.error.errorCode && e.error.errorCode === 'MISSING_PROFILE') {
          return of(new UserProfileDecorator());
        }
        return throwError(() => e);
      })
    );
  }

  public saveProfile(isNew: boolean, profile: UserProfile): Observable<any> {
    if (isNew) {
      profile.preferredLanguage = this.configuration.defaultLanguageCode;
      return this.postObservable('/profile', JSON.stringify(profile), {}, true)
        .pipe(catchError(e => {
          this.log.logError(this.LOGGER_SOURCE, `Error occurred on user profile creation:`, e);
          return throwError(() => e);
        }));
    } else {
      return this.patchObservable('/profile', JSON.stringify(profile), {}, true)
        .pipe(
          // eslint-disable-next-line  arrow-body-style
          catchError(e => {
            return throwError(() => e);
          }),
          map(x => {
            if (x.body === null) {
              return null;
            }
            return new UserProfileDecorator(x.body);
          }),
          first());
    }
  }
}
