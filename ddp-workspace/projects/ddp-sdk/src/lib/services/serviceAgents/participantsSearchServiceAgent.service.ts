import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable } from 'rxjs';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { map } from 'rxjs/operators';
import { SearchParticipantResponse } from '../../models/searchParticipantResponse';
import { SearchParticipant } from '../../models/searchParticipant';

@Injectable()
export class ParticipantsSearchServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public search(query: string): Observable<SearchParticipantResponse | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/participants-lookup`, { query })
            .pipe(map(result => result?.body));
    }

    public getParticipant(guid: string): Observable<SearchParticipant | null> {
        return this.getObservable(`/admin/studies/${this.configuration.studyGuid}/participants/${guid}`);
    }
}
