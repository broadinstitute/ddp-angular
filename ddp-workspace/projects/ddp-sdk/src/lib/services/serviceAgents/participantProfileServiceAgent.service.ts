import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionServiceAgent } from './sessionServiceAgent.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';
import { LoggingService } from '../logging.service';
import { UserProfile } from '../../models/userProfile';

@Injectable()
export class ParticipantProfileServiceAgent extends SessionServiceAgent<any> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public updateParticipantProfiles(participants: Array<{ guid: string; profile: any}>): Observable<any>[] {
        return participants.map(participant => {
            const {guid, profile} = participant;
            return this.updateParticipantProfile(guid, profile);
        });
    }

    public updateParticipantProfile(guid, profile: UserProfile): Observable<any> {
        const profileChanges: object = {};
        for (const key of Object.keys(profile)) {
            if (profile[key]) {
                profileChanges[key] = profile[key];
            }
        }
        return this.patchObservable(this.getBaseUrl(guid), JSON.stringify(profileChanges));
    }

    private getBaseUrl(participantGuid: string): string {
        return `/user/${participantGuid}/profile`;
    }
}
