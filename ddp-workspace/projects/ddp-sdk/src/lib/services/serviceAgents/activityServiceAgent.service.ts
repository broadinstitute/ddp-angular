import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { combineLatest, Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError, map, switchMap } from 'rxjs/operators';

import { ActivityConverter } from '../activity/activityConverter.service';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../internationalization/languageService.service';
import { AnswerValue } from '../../models/activity/answerValue';
import { AnswerSubmission } from '../../models/activity/answerSubmission';
import { PatchAnswerResponse } from '../../models/activity/patchAnswerResponse';
import { ActivityForm } from '../../models/activity/activityForm';
import { ActivityInstance } from '../../models/activityInstance';
import { CreateActivityInstanceResponse } from '../../models/activity/createActivityInstanceResponse';
import { DeleteActivityInstanceResponse } from '../../models/activity/deleteActivityInstanceResponse';

interface GuidsObject {
    study: string;
    activity: string;
}

@Injectable()
export class ActivityServiceAgent extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        private converter: ActivityConverter,
        http: HttpClient,
        logger: LoggingService,
        private __language: LanguageService) { // tslint:disable-line:variable-name
        super(session, configuration, http, logger, null);
    }

    public getActivity(studyGuid$: Observable<string | null>,
                       activityGuid$: Observable<string | null>): Observable<ActivityForm> {

        const studyGuidEmitted$: Observable<string | null> = this.__language.getProfileLanguageUpdateNotifier()
            .pipe(
                switchMap(() => studyGuid$)
            );

        let getActivity$: (x) => Observable<any>;
        getActivity$ = (x: GuidsObject) => {
            if (x.study == null || x.study === '' ||
                x.activity == null || x.activity === '') {
                return of(null);
            }
            const baseUrl = this.getBaseUrl(x.study, x.activity);
            return this.getObservable(baseUrl, {}, [404]);
        };

        return combineLatest([studyGuidEmitted$, activityGuid$]).pipe(
            map((guids: Array<string>) => {
                return {study: guids[0], activity: guids[1]} as GuidsObject;
            }),
            mergeMap((guidsObj: GuidsObject) => getActivity$(guidsObj)),
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

    public getActivitySummary(studyGuid: string, activityGuid: string): Observable<ActivityInstance> {
        const baseUrl = this.getBaseUrl(studyGuid, activityGuid);
        return this.getObservable(`${baseUrl}/summary`, {}, [404]);
    }

    public saveAnswerSubmission(studyGuid: string,
                                activityGuid: string,
                                answerSubmission: AnswerSubmission,
                                throwErrorFlag: boolean): Observable<PatchAnswerResponse> {
        const payload = {answers: [answerSubmission]};
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

    public createInstance(
      studyGuid: string,
      activityCode: string,
      parentInstanceGuid?: string
    ): Observable<CreateActivityInstanceResponse | null> {
        const baseUrl = this.getBaseUrl(studyGuid);
        let body: any = {activityCode};
        if (parentInstanceGuid) {
            body = {...body, parentInstanceGuid};
        }

        return this.postObservable(baseUrl, body).pipe(
            map(x => !!x ? x.body as CreateActivityInstanceResponse : null)
        );
    }

    public saveLastVisitedActivitySection(studyGuid: string, activityGuid: string, index: number): Observable<number> {
        const payload = {index};
        const baseUrl = this.getBaseUrl(studyGuid, activityGuid);
        return this.patchObservable(baseUrl, payload).pipe(
            map(httpResponse => httpResponse));
    }

    public deleteActivityInstance(studyGuid: string, activityGuid: string): Observable<DeleteActivityInstanceResponse | null> {
        const baseUrl = this.getBaseUrl(studyGuid, activityGuid);

        return this.deleteObservable(baseUrl, null, true).pipe(
            map(response => !!response ? response.body as DeleteActivityInstanceResponse : null)
        );
    }

    private getBaseUrl(studyGuid: string, activityGuid: string = ''): string {
        const activityGuidPart = activityGuid ? `/${activityGuid}` : '';
        return `/studies/${studyGuid}/activities${activityGuidPart}`;
    }
}
