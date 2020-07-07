import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Invitation } from '../../models/invitation';
import { ConfigurationService } from '../configuration.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserInvitationServiceAgent extends UserServiceAgent<Array<Invitation>> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getInvitations(): Observable<Array<Invitation> | null> {
        return this.getObservable(`/studies/${this.configuration.studyGuid}/invitations`);
    }
}
