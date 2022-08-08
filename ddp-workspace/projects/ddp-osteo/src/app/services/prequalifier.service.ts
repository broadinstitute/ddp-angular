import { Inject, Injectable } from '@angular/core';
import {
    ConfigurationService,
    LoggingService,
    SessionMementoService,
    LanguageService,
    UserServiceAgent,
} from 'ddp-sdk';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PrequalifierService extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService
    ) {
        super(session, configuration, http, logger, _language);
    }

    getPrequalifier(studyGuid: string): Observable<any> {
        return this.getObservable(`/studies/${studyGuid}/prequalifier`);
    }
}
