import { Observable } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Email } from './../../models/email';
import { LoggingService } from './../../services/logging.service';
import { ConfigurationService } from './../../services/configuration.service';
import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';

@Injectable()
export class ResendEmailServiceAgent extends NotAuthenticatedServiceAgent<any> {
    constructor(
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(configuration, http, logger);
    }

    public addToResend(email: Email, studyGuid: string): Observable<any> {
        return this.postObservable(`/studies/${studyGuid}/send-email`, JSON.stringify(email));
    }
}
