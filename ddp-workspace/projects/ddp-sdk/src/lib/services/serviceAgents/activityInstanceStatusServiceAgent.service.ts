import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { LanguageService } from '../languageService.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ActivityInstanceState } from '../../models/activity/activityInstanceState';
import { Observable } from 'rxjs';

@Injectable()
export class ActivityInstanceStatusServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public getStatuses(): Observable<Array<ActivityInstanceState>> {
        return this.getObservable(`/activity-instance-status-types`, null);
    }
}
