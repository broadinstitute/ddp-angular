import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminServiceAgent } from './adminServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudySubject } from '../../models/studySubject';
import { UserGuid } from '../../models/userGuid';


@Injectable()
export class SubjectInvitationServiceAgent extends AdminServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public updateInvitationDetails(invitationId: string, notes: string): Observable<any | null> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/invitation-details`, { invitationId, notes });
    }

    public lookupInvitation(invitationId: string): Observable<StudySubject | null> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/invitation-lookup`, { invitationId }).pipe(
            map(response => response ? response.body : null)
        );
    }

    public createStudyParticipant(invitationId: string): Observable<UserGuid | null> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/participants`, { invitationId }).pipe(
            map(response => response ? response.body : null)
        );
    }

    public createUserLoginAccount(userGuid: string, email: string): Observable<any | null> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/user/${userGuid}/login-account`, { email });
    }
}
