import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Observable } from 'rxjs';

@Injectable()
export class ConsentServiceAgent extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject("ddp.config") configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getSummary(studyGuid: string, consentCode: string) : Observable<any> {
        return this.getObservable(`/studies/${studyGuid}/consents/${consentCode}`, null);
    }
}
