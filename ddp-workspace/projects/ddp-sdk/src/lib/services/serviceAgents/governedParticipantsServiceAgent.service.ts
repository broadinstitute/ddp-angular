import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OperatorServiceAgent } from './operatorServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { Participant } from '../../models/participant';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class GovernedParticipantsServiceAgent extends OperatorServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public add(alias: string): Observable<void> {
        return this.postObservable(`/participants`, { alias: alias });
    }

    public getList(): Observable<Array<Participant>> {
        return this.getObservable(`/participants`).pipe(
            filter(x => x != null),
            map(x => x.participants)
        );
    }

    public getGovernedStudyParticipants(studyGuid: string): Observable<Array<Participant>> {
        return this.getObservable(`/studies/${studyGuid}/participants`);
    }
}