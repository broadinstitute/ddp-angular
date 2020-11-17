import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StudyDetail } from '../../models/studyDetail';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { SessionServiceAgent } from './sessionServiceAgent.service';

@Injectable()
export class StudyDetailServiceAgent extends SessionServiceAgent<StudyDetail> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public get studyDetail(): Observable<StudyDetail> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}`);
    }
}
