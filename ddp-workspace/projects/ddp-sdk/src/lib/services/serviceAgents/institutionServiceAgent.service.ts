import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../languageService.service';
import { Institution } from '../../models/institution';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable()
export class InstitutionServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public getSummary(input: Observable<string>): Observable<Institution[]> {
        return input.pipe(
            flatMap(item =>
                this.getObservable(`/autocomplete/institution?namePattern=${item}`, null),
                (x, y) => y)
        );
    }
}
