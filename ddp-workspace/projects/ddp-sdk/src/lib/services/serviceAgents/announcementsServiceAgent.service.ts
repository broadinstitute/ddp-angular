import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from './../configuration.service';
import { UserServiceAgent } from './userServiceAgent.service';
import { SessionMementoService } from '../sessionMemento.service';
import { AnnouncementsMessage } from './../../models/announcementsMessage';
import { Observable } from 'rxjs';

@Injectable()
export class AnnouncementsServiceAgent extends UserServiceAgent<Array<AnnouncementsMessage>> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getMessage(studyGuid: string): Observable<Array<AnnouncementsMessage> | null> {
        return this.getObservable(`/studies/${studyGuid}/announcements`);
    }
}
