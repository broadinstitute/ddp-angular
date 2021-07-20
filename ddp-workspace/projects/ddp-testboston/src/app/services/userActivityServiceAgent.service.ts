import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService, ConfigurationService, SessionMementoService, ActivityInstance, LanguageService, UserServiceAgent } from 'ddp-sdk';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppUserActivityServiceAgent extends UserServiceAgent<Array<ActivityInstance>> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public getActivities(studyGuid: Observable<string | null>): Observable<Array<ActivityInstance> | null> {
        return studyGuid.pipe(
            mergeMap(x => x ? this.getObservable(`/studies/${x}/activities`) : of(null)),
            map((activities) => activities
                ? activities.map(activity => activity.activityCode === 'ADHOC_SYMPTOM' && activity.statusCode === 'CREATED'
                    ? {...activity, icon: null}
                    : activity)
                : null)
            );
    }
}
