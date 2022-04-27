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
    private readonly BASE_URL = '/profile';

    constructor(
        session: SessionMementoService,
        @Inject('ddp.config') configuration: ConfigurationService,
        http: HttpClient,
        logger: LoggingService) {
        super(session, configuration, http, logger, null);
    }

    public get profile(): Observable<UserProfileDecorator> {
        return this.getObservable(this.BASE_URL, {}, [404]).pipe(
            map(x => {
                if (x === null) {
                    return null;
                }
                return new UserProfileDecorator(x);
            }),
            catchError(e => {
                if (e.error && e.error.code && e.error.code === 'MISSING_PROFILE') {
                    return of(new UserProfileDecorator());
                }
                return throwError(() => e);
            })
        );
    }

    public saveProfile(isNew: boolean, profile: UserProfile): Observable<any> {
        if (!profile.preferredLanguage) {
            profile.preferredLanguage = 'en';
        }
        if (isNew) {
            return this.postObservable(this.BASE_URL, JSON.stringify(profile));
        } else {
            return this.patchObservable(this.BASE_URL, JSON.stringify(profile));
        }
    }

    public updateProfile(profile: UserProfile): Observable<any> {
        // save non-null profile attributes
        const profileChanges: object = {};
        for (const key of Object.keys(profile)) {
            if (profile[key]) {
                profileChanges[key] = profile[key];
            }
        }
        return this.patchObservable(this.BASE_URL, JSON.stringify(profileChanges));
    }

    public createProfile(profile: UserProfile): Observable<any> {
        return this.postObservable(this.BASE_URL, JSON.stringify(profile));
    }
}
