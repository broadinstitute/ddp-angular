import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserServiceAgent } from './userServiceAgent.service';
import { LoggingService } from '../logging.service';
import { SessionMementoService } from '../sessionMemento.service';
import { ConfigurationService } from '../configuration.service';
import { UserProfile } from '../../models/userProfile';
import { UserProfileDecorator } from '../../models/userProfileDecorator';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UserProfileServiceAgent extends UserServiceAgent<UserProfile> {
    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger);
    }

    public get profile(): Observable<UserProfileDecorator> {
        return this.getObservable('/profile', {}, [400]).pipe(
            map(x => {
                if (x === null) {
                    return null;
                }
                return new UserProfileDecorator(x);
            }),
            catchError(e => {
                if (e.error && e.error.errorCode && e.error.errorCode === 'MISSING_PROFILE') {
                    return of(new UserProfileDecorator());
                }
                return throwError(e);
            })
        );
    }

    public saveProfile(isNew: boolean, profile: UserProfile): Observable<any> {
        profile.preferredLanguage = 'en';
        if (isNew) {
            return this.postObservable('/profile', JSON.stringify(profile));
        } else {
            return this.patchObservable('/profile', JSON.stringify(profile));
        }
    }

    private createProfile(profile: UserProfile): Observable<any> {
        return this.postObservable('/profile', JSON.stringify(profile));
    }
}
