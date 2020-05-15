import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { InvitationCheckPayload } from '../../../../../ddp-testboston/src/app/models/invitationCheckPayload';
import { DdpError } from '../../../../../ddp-testboston/src/app/models/ddpError';
import { ErrorType } from '../../../../../ddp-testboston/src/app/models/errorType';

@Injectable()
export class InvitationServiceAgent extends NotAuthenticatedServiceAgent<any> {
    private readonly OK_STATUS = 200;

    constructor(
        @Inject('ddp.config') _configuration: ConfigurationService,
        _http: HttpClient,
        _logger: LoggingService) {
        super(_configuration, _http, _logger);
    }

    public check(invitationId: string, recaptchaToken: string, zip?: string): Observable<any> {
        const payload: InvitationCheckPayload = {
            invitationId,
            zip,
            recaptchaToken,
            auth0ClientId: this.configuration.auth0ClientId};
        return this.postObservable(`/studies/${this.configuration.studyGuid}/invitation-check`,  payload, {}, true)
            .pipe(
                map(response => response ? response.body : null),
                catchError(err => {
                    console.log('got an error and it is: %o', err);
                    const errorType = err.status === 400 ? ErrorType.InvalidInvitation : ErrorType.Unknown;
                    return throwError(new DdpError('Problem with submission', errorType));
                })
            );
    }

    public verify(invitationId: string): Observable<never> {
        return this.postObservable(`/studies/${this.configuration.studyGuid}/invitation-verify`, { invitationId })
            .pipe(
                mergeMap(response => response && response.status === this.OK_STATUS ? EMPTY : throwError('Email verification failed'))
            );
    }
}
