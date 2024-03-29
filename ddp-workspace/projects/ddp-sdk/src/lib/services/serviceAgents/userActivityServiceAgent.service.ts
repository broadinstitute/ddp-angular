import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ActivityInstance } from '../../models/activityInstance';
import { LanguageService } from '../internationalization/languageService.service';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserServiceAgent } from './userServiceAgent.service';

@Injectable()
export class UserActivityServiceAgent extends UserServiceAgent<Array<ActivityInstance>> {
    constructor(
        private session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService,
        _language: LanguageService) {
        super(session, configuration, http, logger, _language);
    }

    public getActivities(studyGuid: Observable<string | null>, participantGuid?: string): Observable<Array<ActivityInstance> | null> {
        return studyGuid.pipe(mergeMap(x => {
            if (x) {
                const previousParticipantGuid = this.session.session.participantGuid;
                if (participantGuid) {
                    this.session.setParticipant(participantGuid);
                }
                let activitiesObservable: Observable<Array<ActivityInstance>> = of([]);
                try {
                    activitiesObservable = this.getObservable(`/studies/${x}/activities`);
                } finally {
                    if (participantGuid) {
                        this.session.setParticipant(previousParticipantGuid);
                    }
                }
                return activitiesObservable;
            }
            return of(null);
        }));
    }
}
