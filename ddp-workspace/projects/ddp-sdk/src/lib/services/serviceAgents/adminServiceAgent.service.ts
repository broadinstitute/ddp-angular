import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';

@Injectable()
export class AdminServiceAgent<TEntity> extends SessionServiceAgent<TEntity> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    protected getBackendUrl(): string {
        return this.configuration.backendUrl + '/pepper/v1/admin';
    }
}
