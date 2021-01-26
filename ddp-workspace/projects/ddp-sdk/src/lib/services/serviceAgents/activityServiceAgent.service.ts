import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityConverter } from '../activity/activityConverter.service';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../internationalization/languageService.service';
import { AnswerValue } from '../../models/activity/answerValue';
import { ActivityInstanceGuid } from '../../models/activityInstanceGuid';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { flatMap, catchError, map, switchMap } from 'rxjs/operators';
import { AnswerSubmission } from '../../models/activity/answerSubmission';
import { PatchAnswerResponse } from '../../models/activity/patchAnswerResponse';
import { ActivityForm } from '../../models/activity/activityForm';

@Injectable()
export class ActivityServiceAgent extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        private converter: ActivityConverter,
        http: HttpClient,
        logger: LoggingService,
        private _language: LanguageService) {
        super(session, configuration, http, logger, null);
    }

    public getActivity(studyGuid: Observable<string | null>,
        activityGuid: Observable<string | null>): Observable<ActivityForm> {
        return this._language.getProfileLanguageUpdateNotifier().pipe(
          switchMap(() => studyGuid)).pipe(
          combineLatest([activityGuid], (x, y) => {
            return { study: x, activity: y };
          }),
          flatMap(x => {
            if (x.study == null || x.study === '' ||
              x.activity == null || x.activity === '') {
              return of(null);
            }
            const baseUrl = this.getBaseUrl(x.study, x.activity);
            return this.getObservable(baseUrl, {}, [404]);
          }, (x, y) => y),
          catchError(e => {
            if (e.error && e.error.code && e.error.code === 'ACTIVITY_NOT_FOUND') {
              return throwError('ACTIVITY_NOT_FOUND');
            }
            return throwError(e);
          }),
          map(x => {
            if (x == null) {
              return null;
            }
            return this.converter.convertActivity(x);
          })
        );
    }

    public saveAnswerSubmission(studyGuid: string,
        activityGuid: string,
        answerSubmission: AnswerSubmission,
        throwErrorFlag: boolean): Observable<PatchAnswerResponse> {
        const payload = { answers: [answerSubmission] };
        const baseUrl = this.getBaseUrl(studyGuid, activityGuid);
        return this.patchObservable(`${baseUrl}/answers`, payload, {}, throwErrorFlag).pipe(
            map(httpResponse => httpResponse.body));
    }

    public saveAnswer(studyGuid: string,
        activityGuid: string,
        questionStableId: string,
        value: AnswerValue,
        answerId: string | null = null,
        throwErrorFlag = false): Observable<any> {
        const data: AnswerSubmission = {
            stableId: questionStableId,
            answerGuid: answerId,
            value
        };

        return this.saveAnswerSubmission(studyGuid, activityGuid, data, throwErrorFlag);
    }

    public flushForm(studyGuid: string, activityGuid: string): Observable<any> {
        const baseUrl = this.getBaseUrl(studyGuid, activityGuid);
        return this.putObservable(`${baseUrl}/answers`, null);
    }

    public createInstance(studyGuid: string, activityCode: string): Observable<ActivityInstanceGuid | null> {
        const baseUrl = this.getBaseUrl(studyGuid);
        return this.postObservable(baseUrl, { activityCode }).pipe(
            map(x => !!x ? x.body as ActivityInstanceGuid : null)
        );
    }

    public saveLastVisitedActivitySection(studyGuid: string, activityGuid: string, index: number): Observable<number> {
        const payload = { index };
        const baseUrl = this.getBaseUrl(studyGuid, activityGuid);
        return this.patchObservable(baseUrl, payload).pipe(
            map(httpResponse => httpResponse));
    }

    private getBaseUrl(studyGuid: string, activityGuid: string = ''): string {
        const activityGuidPart = activityGuid ? `/${activityGuid}` : '';
        return `/studies/${studyGuid}/activities${activityGuidPart}`;
    }
}
