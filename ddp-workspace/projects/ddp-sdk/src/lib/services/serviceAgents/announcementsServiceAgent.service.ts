import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { UserServiceAgent } from './userServiceAgent.service';
import { SessionMementoService } from '../sessionMemento.service';
import { AnnouncementMessage } from '../../models/announcementMessage';
import { Observable } from 'rxjs';

@Injectable()
export class AnnouncementsServiceAgent extends UserServiceAgent<Array<AnnouncementMessage>> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getMessages(studyGuid: string): Observable<Array<AnnouncementMessage> | null> {
        return this.getObservable(`/studies/${studyGuid}/announcements`);
    }
}
