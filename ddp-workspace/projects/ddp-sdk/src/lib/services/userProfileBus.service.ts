import { filter } from 'rxjs/operators';
import { Auth0AdapterService } from './authentication/auth0Adapter.service';
import { SessionMementoService } from './sessionMemento.service';
import { UserProfileDto } from '../models/userProfileDto';
import { LoggingService } from './logging.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { Session } from '../models/session';

@Injectable()
export class UserProfileBusService implements OnDestroy {
    private readonly profile: BehaviorSubject<UserProfileDto | null>;
    private anchor: Subscription;

    constructor(
        private session: SessionMementoService,
        private auth0: Auth0AdapterService,
        private log: LoggingService) {
        this.profile = new BehaviorSubject<UserProfileDto | null>(null);
        this.anchor = session.sessionObservable.pipe(
            filter(x => x != null)
        ).subscribe(x => x && this.loadProfile(x));
        this.anchor = session.sessionObservable.pipe(
            filter(x => x == null)
        ).subscribe(() => this.profile.next(null));
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public getProfile(): Observable<UserProfileDto | null> {
        return this.profile.asObservable();
    }

    public loadProfile(currentSession: Session) {
        const self = this;
        this.auth0.webAuth.client.userInfo(currentSession.accessToken,
            (err, profile) => {
                if (profile) {
                    self.profile.next(new UserProfileDto(profile.name));
                }
                else if (err) {
                    this.log.logError('auth0Adapter.getProfile', err);
                }
            });
    }
}
