import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { TemporaryUser } from '../../models/temporaryUser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TemporaryUserServiceAgent extends NotAuthenticatedServiceAgent<TemporaryUser> {
    constructor(
        @Inject('ddp.config') _configuration: ConfigurationService,
        _http: HttpClient,
        _logger: LoggingService) {
        super(_configuration, _http, _logger);
    }

    public createTemporaryUser(auth0ClientId: string): Observable<TemporaryUser | null> {
        return this.postObservable('/temporary-users', JSON.stringify({ auth0ClientId }))
            .pipe(map(data => data && data['body']));
    }
}
