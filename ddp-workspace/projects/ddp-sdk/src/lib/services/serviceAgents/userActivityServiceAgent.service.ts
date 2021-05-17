import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ActivityInstance } from '../../models/activityInstance';
import { LanguageService } from '../internationalization/languageService.service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class UserActivityServiceAgent extends UserServiceAgent<Array<ActivityInstance>> {
    private selectedUserGuid: string|null;

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public getActivities(studyGuid: Observable<string | null>): Observable<Array<ActivityInstance> | null> {
        return studyGuid.pipe(
            mergeMap(x => x ? this.getObservable(`/studies/${x}/activities`)
                : of(null)));
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
