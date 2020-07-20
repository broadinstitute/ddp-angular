import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivityConverter } from '../activity/activityConverter.service';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../languageService.service';
import { AnswerValue } from '../../models/activity/answerValue';
import { ActivityInstanceGuid } from '../../models/activityInstanceGuid';
import { Observable, of, throwError } from 'rxjs';
import { combineLatest, flatMap, catchError, map, switchMap } from 'rxjs/operators';
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
        super(session, configuration, http, logger);
    }

    public getActivity(studyGuid: Observable<string | null>,
        activityGuid: Observable<string | null>): Observable<ActivityForm> {
        return this._language.getProfileLanguageUpdateNotifier().pipe(
          switchMap(() => studyGuid)).pipe(
          combineLatest(activityGuid, (x, y) => {
            return { study: x, activity: y };
          }),
          flatMap(x => {
            if (x.study == null || x.study === '' ||
              x.activity == null || x.activity === '') {
              return of(null);
            }
            return this.getObservable(`/studies/${x.study}/activities/${x.activity}`, {}, [404]);
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

    public saveAnswerSubmission(studyGuid: string, activityGuid: string, answerSubmission: AnswerSubmission,
        throwError: boolean): Observable<PatchAnswerResponse> {
        const payload = { answers: [answerSubmission] };
        return this.patchObservable(`/studies/${studyGuid}/activities/${activityGuid}/answers`, payload, {}, throwError).pipe(
            map(httpResponse => httpResponse.body));
    }

    public saveAnswer(studyGuid: string,
        activityGuid: string,
        questionStableId: string,
        value: AnswerValue,
        answerId: string | null = null, throwError = false): Observable<any> {
        const data: AnswerSubmission = {
            stableId: questionStableId,
            answerGuid: answerId,
            value
        };

        return this.saveAnswerSubmission(studyGuid, activityGuid, data, throwError);
    }

    public flushForm(studyGuid: string, activityGuid: string): Observable<any> {
        return this.putObservable(`/studies/${studyGuid}/activities/${activityGuid}/answers`, null);
    }

    public createInstance(studyGuid: string, activityCode: string): Observable<ActivityInstanceGuid | null> {
        return this.postObservable(`/studies/${studyGuid}/activities`, { activityCode }).pipe(
            map(x => !!x ? x.body as ActivityInstanceGuid : null)
        );
    }
}
