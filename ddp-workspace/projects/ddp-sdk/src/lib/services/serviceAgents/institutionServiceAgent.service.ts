import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Institution } from '../../models/institution';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable()
export class InstitutionServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public getSummary(input: Observable<string>, limit?: number): Observable<Institution[]> {
        return input.pipe(
            flatMap(item => {
                const queryParams = {
                    namePattern: item,
                    ...(limit && limit >= 0) ? { limit } : {}
                };
                return this.getObservable('/autocomplete/institution', { params : queryParams });
            }, (x, y) => y)
        );
    }
}
