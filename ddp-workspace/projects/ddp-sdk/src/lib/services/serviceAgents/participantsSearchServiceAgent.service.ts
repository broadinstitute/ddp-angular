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
import { SessionStorageService } from '../sessionStorage.service';

@Injectable()
export class ParticipantsSearchServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        private sessionStorage: SessionStorageService) {
        super(session, configuration, http, logger, null);
    }

    public search(query: string): Observable<SearchParticipantResponse | null> {
        return this.postObservable(`/admin/studies/${this.configuration.studyGuid}/participants-lookup`, { query })
            .pipe(map(result => result?.body));
    }

    public getParticipant(guid: string): Observable<SearchParticipant | null> {
        const selectedUserStorageName = `${this.configuration.studyGuid}_selected_user`;
        const selectedUserFromStorage = JSON.parse(this.sessionStorage.get(selectedUserStorageName));
        if (guid) {
            if (selectedUserFromStorage && selectedUserFromStorage.guid === guid) {
                return of(selectedUserFromStorage);
            } else {
                return this.getObservable(`/admin/studies/${this.configuration.studyGuid}/participants/${guid}`).pipe(tap((result) => {
                    this.sessionStorage.set(selectedUserStorageName, JSON.stringify(result));
                }));
            }
        } else {
            return of(null);
        }
    }
}
