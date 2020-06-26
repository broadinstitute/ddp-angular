import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ActivityInstance } from '../../models/activityInstance';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class UserActivityServiceAgent extends UserServiceAgent<Array<ActivityInstance>> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getActivities(studyGuid: Observable<string | null>): Observable<Array<ActivityInstance> | null> {
        return studyGuid.pipe(
            mergeMap(x => x ? this.getObservable(`/studies/${x}/activities`)
                : of(null)));
    }
}
