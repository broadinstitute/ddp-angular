import { map, catchError } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AdminServiceAgent } from './adminServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Observable, throwError, of } from 'rxjs';
import { StudySubject } from '../../models/studySubject';
import { UserGuid } from '../../models/userGuid';
import { DdpError } from '../../models/ddpError';
import { ErrorType } from '../../models/errorType';

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
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/invitation-details`, { invitationId, notes });
    }

    public lookupInvitation(invitationId: string): Observable<StudySubject | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/invitation-lookup`, { invitationId }, {}, true).pipe(
            map(response => response ? response.body : null),
            catchError((error: HttpErrorResponse) => {
                return throwError(this.buildErrorObject(error));
            })
        );
    }

    public createStudyParticipant(invitationId: string): Observable<UserGuid | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/participants`, { invitationId });
    }

    private buildErrorObject(serverError: HttpErrorResponse): DdpError {
        return new DdpError(serverError.error ? serverError.error.message : '', this.buildErrorType(serverError));
    }

    private buildErrorType(serverError: HttpErrorResponse): ErrorType {
        if (serverError.error && serverError.error.code === 'NOT_FOUND') {
            return ErrorType.InvitationNotFound;
        }
        return ErrorType.UnknownError;
    }
}
