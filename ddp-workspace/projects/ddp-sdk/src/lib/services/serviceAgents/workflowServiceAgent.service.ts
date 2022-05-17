import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
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
        const baseUrl = this.getBaseUrl();
        return this.getObservable(`${baseUrl}?from=${state}&activityCode=${activityCode}`, null);
    }

    public byInstanceGuid(state: string, instanceGuid: string): Observable<ActivityResponse | null> {
        const baseUrl = this.getBaseUrl();
        return this.getObservable(`${baseUrl}?from=${state}&instanceGuid=${instanceGuid}`, null);
    }

    public getNext(): Observable<ActivityResponse | null> {
        const baseUrl = this.getBaseUrl();
        return this.getObservable(`${baseUrl}?from=RETURN_USER`, null);
    }

    public getStart(): Observable<ActivityResponse | null> {
        const baseUrl = this.getBaseUrl();
        return this.getObservable(`${baseUrl}?from=START`, null);
    }

    public fromParticipantList(unrecoverableStatuses?: Array<number>): Observable<ActivityResponse | null> {
        const baseUrl = this.getBaseUrl();
        return this.getObservable(`${baseUrl}?from=PARTICIPANT_LIST`, null, unrecoverableStatuses);
    }

    private getBaseUrl(): string {
        return `/studies/${this.configuration.studyGuid}/workflow`;
    }
}
