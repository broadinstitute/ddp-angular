import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService, ConfigurationService, SessionMementoService, ActivityInstance, LanguageService, UserServiceAgent } from 'ddp-sdk';
import { Observable, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

/**
 * This service allows to modify the activity data for testboston only (remove the icon for certain type of activity with certain status).
 * It was decided to change it on front-end side since backend redesign will take a lot of effort
 * and testboston project is going to end soon
 */
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
