import { NotAuthenticatedServiceAgent } from './notAuthenticatedServiceAgent.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from './../../models/person';
import { LoggingService } from './../logging.service';
import { ConfigurationService } from './../configuration.service';
import { Observable } from 'rxjs';
import { LanguageService } from '../internationalization/languageService.service';

@Injectable()
export class MailingListServiceAgent extends NotAuthenticatedServiceAgent<any> {
    constructor(
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        private langService: LanguageService) {
        super(configuration, http, logger);
    }

    public join(person: Person): Observable<any> {
        const payload = {
            firstName: person.firstName,
            lastName: person.lastName,
            emailAddress: person.emailAddress,
            info: person.info,
            umbrellaGuid: person.umbrellaGuid,
            studyGuid: person.studyGuid,
            isoLanguageCode: this.langService.getCurrentLanguage()
        };
        return this.postObservable(`/mailing-list`, payload);
    }
}
