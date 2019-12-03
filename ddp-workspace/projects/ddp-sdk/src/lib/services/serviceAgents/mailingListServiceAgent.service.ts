import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from './../../models/person';
import { LoggingService } from './../logging.service';
import { ConfigurationService } from './../configuration.service';
import { Observable } from 'rxjs';

@Injectable()
export class MailingListServiceAgent extends NotAuthenticatedServiceAgent<any> {
    constructor(
        @Inject("ddp.config") configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(configuration, http, logger);
    }

    public addPerson(person: Person): Observable<any> {
        return this.postObservable(`/mailing-list`, JSON.stringify(person));
    }
} 