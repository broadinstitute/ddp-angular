import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from './../sessionMemento.service';
import { LoggingService } from '../logging.service';
import { ActivityResponse } from '../../models/activity/activityResponse';
import { Observable } from 'rxjs';

@Injectable()
export class WorkflowServiceAgent extends UserServiceAgent<ActivityResponse> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public byActivityCode(state: string, activityCode: string): Observable<ActivityResponse | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/workflow?from=${state}&activityCode=${activityCode}`, null);
    }

    public byInstanceGuid(state: string, instanceGuid: string): Observable<ActivityResponse | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/workflow?from=${state}&instanceGuid=${instanceGuid}`, null);
    }

    public getNext(): Observable<ActivityResponse | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/workflow?from=RETURN_USER`, null);
    }

    public getStart(): Observable<ActivityResponse | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/workflow?from=START`, null);
    }

    public fromDashboard(): Observable<ActivityResponse | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/workflow?from=DASHBOARD`, null);
    }

    public fromParticipantList(): Observable<ActivityResponse | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/workflow?from=PARTICIPANT_LIST`, null);
    }
}
