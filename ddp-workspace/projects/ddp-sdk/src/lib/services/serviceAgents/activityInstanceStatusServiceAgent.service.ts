import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Observable } from 'rxjs';

@Injectable()
export class ActivityInstanceStatusServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject("ddp.config") configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getStatuses(): Observable<any> {
        return this.getObservable(`/activity-instance-status-types`, null);
    }
}