import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable, throwError, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class InvitationsServiceAgent extends NotAuthenticatedServiceAgent<any> {
    private readonly OK_STATUS = 200;

    constructor(
        @Inject('ddp.config') _configuration: ConfigurationService,
        _http: HttpClient,
        _logger: LoggingService) {
        super(_configuration, _http, _logger);
    }

    public verify(invitationId: string): Observable<never> {
        return this.postObservable('/invitations/verify', { invitationId })
            .pipe(
                mergeMap(response => response && response.status === this.OK_STATUS ? EMPTY : throwError('Email verification failed'))
            );
    }
}
