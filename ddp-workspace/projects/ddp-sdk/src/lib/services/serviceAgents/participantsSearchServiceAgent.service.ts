import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { Observable, of } from 'rxjs';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { map, delay } from 'rxjs/operators';
import { SearchParticipantResponse } from '../../models/searchParticipantResponse';
import { SearchParticipant } from '../../models/searchParticipant';
import { EnrollmentStatusType } from '../../models/enrollmentStatusType';

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
        // return this.getObservable(`/admin/studies/${this.configuration.studyGuid}/participants/${guid}`)
        //     .pipe(map(result => result?.body));
        return of({
            guid: 'NTTUMZ58OIPDPO6PSPTT',
            hruid: '5678',
            firstName: 'Bob',
            lastName: 'Adams',
            status: EnrollmentStatusType.COMPLETED,
            invitationId: 'TBM398WQ8P6Z',
            legacyShortId: '12',
            proxy: {
                guid: '1235',
                hruid: '5679',
                firstName: 'Tom',
                lastName: 'Adams',
                email: 'proxytest@test.com',
            }
        }).pipe(delay(500));
    }
}
