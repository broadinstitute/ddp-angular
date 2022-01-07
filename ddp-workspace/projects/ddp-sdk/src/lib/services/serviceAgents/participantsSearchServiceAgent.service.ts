import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable, of } from 'rxjs';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { map, tap } from 'rxjs/operators';
import { SearchParticipantResponse } from '../../models/searchParticipantResponse';
import { SearchParticipant } from '../../models/searchParticipant';

@Injectable()
export class ParticipantsSearchServiceAgent extends SessionServiceAgent<any> {
    private participantMap = new Map<string, SearchParticipant | null>();

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
        const participant = this.participantMap.get(this.session.session?.participantGuid);
        return participant ? of(participant) : this.getParticipantData();
    }

    private getParticipantData(): Observable<SearchParticipant | null> {
        const { session } = this.session;
        // eslint-disable-next-line curly
        if (!session?.participantGuid || !this.isAdmin()) return of(null);

        return this.getObservable(`/admin/studies/${this.configuration.studyGuid}/participants/${session.participantGuid}`)
            .pipe(tap(result => {
                this.participantMap.set(this.session.session.participantGuid, result);
            }));
    }

    private isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }
}
