import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VerifyInvitationServiceAgent extends NotAuthenticatedServiceAgent<any> {
    constructor(
        @Inject('ddp.config') _configuration: ConfigurationService,
        _http: HttpClient,
        _logger: LoggingService) {
        super(_configuration, _http, _logger);
    }

    public verify(invitationId: string): Observable<number | null> {
        return this.postObservable('/invitations/verify', { invitationId })
            .pipe(map(response => response && response.status ? response.status : null));
    }
}
