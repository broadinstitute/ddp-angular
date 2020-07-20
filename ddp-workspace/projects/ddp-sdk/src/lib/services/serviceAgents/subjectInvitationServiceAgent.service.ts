import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../languageService.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StudySubject } from '../../models/studySubject';
import { InvitationCheckPayload } from '../../models/invitationCheckPayload';
import { SessionServiceAgent } from './sessionServiceAgent.service';

@Injectable()
export class SubjectInvitationServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public updateInvitationDetails(invitationId: string, notes: string): Observable<any | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/invitation-details`, { invitationId, notes });
    }

    public lookupInvitation(invitationId: string): Observable<StudySubject | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/invitation-lookup`, { invitationId }).pipe(
            map(response => response ? response.body : null)
        );
    }

    public createStudyParticipant(invitationId: string): Observable<string | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/participants`, { invitationId }).pipe(
            map(response => response && response.body ? response.body.userGuid : null)
        );
    }

    public createUserLoginAccount(userGuid: string, email: string): Observable<string | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/user/${userGuid}/login-account`, { email });
    }

    public verifyZipCode(invitationId: string, zipCode: string): Observable<any> {
        const payload: InvitationCheckPayload = {
            invitationId,
            qualificationDetails: {
                zipCode
            },
            auth0ClientId: this.configuration.auth0ClientId
        };
        return this.postObservable(`/studies/${this.configuration.studyGuid}/invitation-check`, payload);
    }
}
