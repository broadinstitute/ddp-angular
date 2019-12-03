import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class PrequalifierServiceAgent extends UserServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject("ddp.config") configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public getPrequalifier(studyGuid: string): Observable<string> {
        return this.getObservable(`/studies/${studyGuid}/prequalifier`).pipe(
            filter(x => x != null),
            map(x => x.guid)
        );
    }
}