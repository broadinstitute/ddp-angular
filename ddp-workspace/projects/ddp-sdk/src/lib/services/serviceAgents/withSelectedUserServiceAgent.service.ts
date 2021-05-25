import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../internationalization/languageService.service';

@Injectable()
export class WithSelectedUserServiceAgent<TEntity> extends UserServiceAgent<TEntity> {
    protected selectedUserGuid: string|null;

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public updateSelectedUser(guid: string): void {
        this.selectedUserGuid = guid;
    }

    public resetSelectedUser(): void {
        this.selectedUserGuid = null;
    }

    protected getBackendUrl(): string {
        return this.configuration.backendUrl + '/pepper/v1/user/' + (this.selectedUserGuid || this.userGuid);
    }
}
