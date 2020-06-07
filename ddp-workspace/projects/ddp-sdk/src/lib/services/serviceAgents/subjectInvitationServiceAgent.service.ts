import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminServiceAgent } from './adminServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Observable, of } from 'rxjs';
import { StudySubject } from '../../models/studySubject';
import { UserGuid } from '../../models/userGuid';
import { delay } from 'rxjs/operators';


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
        // return this.postObservable(`/studies/${this.configuration.studyGuid}/invitation-lookup`, { invitationId });
        if (invitationId === '111111111111') {
            return of({
                invitationId: '111111111111',
                createdAt: '',
                voidedAt: '',
                verifiedAt: '',
                acceptedAt: '',
                userGuid: 'USER_GUID',
                userHruid: '',
                userLoginEmail: 'foo@bar.baz',
                notes: 'some notes\nmore notes'
            }).pipe(
                delay(3000)
            );
        }
        if (invitationId === '222222222222') {
            return of({
                invitationId: '222222222222',
                createdAt: '',
                voidedAt: '',
                verifiedAt: '',
                acceptedAt: '',
                userGuid: '',
                userHruid: '',
                userLoginEmail: '',
                notes: ''
            }).pipe(
                delay(3000)
            );
        }
        return of(null).pipe(
            delay(3000)
        );
    }

    public createStudyParticipant(invitationId: string): Observable<UserGuid | null> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/participants`, { invitationId });
    }

    public createUserLoginAccount(userGuid: string, email: string): Observable<any | null> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/user/${userGuid}/login-account`, { email });
    }
}
