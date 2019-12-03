import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { ServiceAgent } from './serviceAgent.service';

@Injectable()
export class NotAuthenticatedServiceAgent<TEntity> extends ServiceAgent<TEntity> {
    constructor(
        @Inject('ddp.config') protected _configuration: ConfigurationService,
        private _http: HttpClient,
        private _logger: LoggingService) {
        super(_configuration, _http, _logger);
    }

    protected getBackendUrl(): string {
        return this.configuration.backendUrl + '/pepper/v1';
    }
}