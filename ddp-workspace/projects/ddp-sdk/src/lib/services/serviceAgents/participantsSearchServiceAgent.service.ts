import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable, of } from 'rxjs';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { filter, map, switchMap } from 'rxjs/operators';
import { SearchParticipantResponse } from '../../models/searchParticipantResponse';
import { SearchParticipant } from '../../models/searchParticipant';

@Injectable()
export class ParticipantsSearchServiceAgent extends SessionServiceAgent<any> {
    constructor(
        private session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public search(query: string): Observable<SearchParticipantResponse | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/participants-lookup`, { query })
            .pipe(map(result => result?.body));
    }

    public getParticipant(): Observable<SearchParticipant | null> {
        return this.session.sessionObservable.pipe(
            filter(session => session !== null),
            switchMap(session => session.participantGuid
                ? this.getObservable(`/admin/studies/${this.configuration.studyGuid}/participants/${session.participantGuid}`)
                : of(null))
        );
    }
}
