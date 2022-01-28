import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { Study } from '../../models/study';

@Injectable()
export class StudiesServiceAgentService extends SessionServiceAgent<Array<Study>> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public get studyDetail(): Observable<Array<Study>> {
        return this.getObservable(`/studies`);
    }
}
