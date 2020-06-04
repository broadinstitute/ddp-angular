import { Injectable, OnDestroy } from '@angular/core';
import { Session } from '../models/session';
import { TemporaryUser } from '../models/temporaryUser';
import { Observable, BehaviorSubject, Subscription, Subject, of, timer, fromEvent } from 'rxjs';
import { filter, map, mergeMap, startWith, tap } from 'rxjs/operators';

@Injectable()
export class SessionMementoService implements OnDestroy {
    private readonly SESSION_KEY: string = 'session_key';
    private readonly TOKEN_KEY = 'token';
    private readonly MSECS_TO_NOTIFICATION = 360000;

    private sessionSubject: BehaviorSubject<Session | null> = new BehaviorSubject<Session | null>(this.session);
    private renewSubject: Subject<number> = new Subject<number>();
    private notificationSubject: Subject<number> = new Subject<number>();

    private otherBrowserTabStorageEvent$: Observable<any>;

    private expirationSubscription: Subscription;
    private renewSubscription: Subscription;
    private notificationSubscription: Subscription;
    private anchor: Subscription = new Subscription();

    constructor() {
        this.observeSessionExpiration();
        this.observeSessionStatus();
        // listen for storage events. Only get notified of storage changes in other tabs
        this.otherBrowserTabStorageEvent$ = fromEvent(window, 'storage');
        // the session storage
        const tab = this.otherBrowserTabStorageEvent$.pipe(
            filter(event => event.key === this.SESSION_KEY),
            filter(event => event.newValue !== event.oldValue),
            map(event => event.newValue)
        ).subscribe((newSessionValue) => {
            if (!newSessionValue) {
                // means other tab logged out. We logout too.
                this.clear();
            } else {
                // copy the value
                this.updateSession(JSON.parse(newSessionValue));
            }
        });
        this.anchor.add(tab);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
        this.expirationSubscription.unsubscribe();
        this.renewSubscription.unsubscribe();
        this.notificationSubscription.unsubscribe();
    }

    public get session(): Session | null {
        const sessionString = localStorage.getItem(this.SESSION_KEY);
        if (sessionString) {
            return JSON.parse(sessionString);
        }

        return null;
    }

    public get token(): string {
        const sessionString = localStorage.getItem(this.SESSION_KEY);
        if (sessionString) {
            return JSON.parse(sessionString).accessToken;
        }

        return '';
    }

    /**
     * Make careful note: this is a hot observable. If you subscribe, expect a stream of values
     * As token gets renewed
     */
    public get sessionObservable(): Observable<Session | null> {
        return this.sessionSubject.asObservable();
    }

    public get renewObservable(): Observable<number> {
        return this.renewSubject.asObservable();
    }

    public get notificationObservable(): Observable<number> {
        return this.notificationSubject.asObservable();
    }

    // todo arz remove expiresIn and userGuid constants, extract them from idToken inside the method
    public setSession(
        accessToken: string,
        idToken: string,
        userGuid: string,
        locale: string,
        expiresAtInSeconds: number,
        participantGuid: string | null = null,
        isAdmin: boolean = false): void {
        const session = new Session(accessToken, idToken, userGuid, locale, expiresAtInSeconds * 1000, participantGuid, isAdmin);
        this.updateSession(session);
    }

    public setTemporarySession(user: TemporaryUser): void {
        const expiresAtInMsec = new Date(user.expiresAt).getTime();
        const session = new Session('', '', user.userGuid, 'en', expiresAtInMsec);
        this.updateSession(session);
    }

    public updateSession(session: Session): void {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        localStorage.setItem(this.TOKEN_KEY, session.idToken);
        this.sessionSubject.next(session);
    }

    public setParticipant(guid: string): void {
        if (this.session === null) {
            return;
        }
        const session = this.session;
        session.participantGuid = guid;
        this.updateSession(session);
    }

    public clear(): void {
        localStorage.removeItem(this.SESSION_KEY);
        this.sessionSubject.next(null);
    }

    public get expiresAt(): number | null {
        if (!this.session) {
            return null;
        }

        return this.session.expiresAt;
    }

    public isAuthenticatedSession(): boolean {
        const session = this.sessionSubject.value;
        if (session === null || this.hasOnlyUserGuid(session)) {
            return false;
        }

        return true;
    }

    public isAuthenticatedAdminSession(): boolean {
        return this.isAuthenticatedSession() && this.sessionSubject.value.isAdmin;
    }

    public isTemporarySession(): boolean {
        const session = this.sessionSubject.value;
        if (session === null) {
            return false;
        }

        return this.hasOnlyUserGuid(session);
    }

    public isAuthenticatedSessionExpired(): boolean {
        return this.isAuthenticatedSession() && this.isSessionExpired();
    }

    public isTemporarySessionExpired(): boolean {
        return this.isTemporarySession() && this.isSessionExpired();
    }

    public disableTokenExpiredProcess(): void {
        this.renewSubscription && this.renewSubscription.unsubscribe();
    }

    public isSessionExpired(): boolean {
        const session = this.sessionSubject.value;
        if (session === null) {
            return false;
        }

        return new Date().getTime() > session.expiresAt;
    }

    private hasOnlyUserGuid(session: Session): boolean {
        return !session.idToken && !!session.userGuid;
    }

    private observeSessionExpiration(): void {
        this.expirationSubscription = this.sessionSubject
            .subscribe(session => {
                if (session) {
                    const now = Date.now();
                    const renewSource = of(Math.max(1, session.expiresAt - now)).pipe(
                        mergeMap(delay => timer(delay))
                    );
                    this.renewSubscription = renewSource.subscribe(() => this.renewSubject.next(0));
                    if (this.isAuthenticatedSession()) {
                        const notificationSource = of(Math.max(1, session.expiresAt - this.MSECS_TO_NOTIFICATION - now)).pipe(
                            mergeMap(delay => timer(delay))
                        );
                        this.notificationSubscription = notificationSource.subscribe(() => this.notificationSubject.next(0));
                    }
                } else {
                    if (this.expirationSubscription) {
                        this.expirationSubscription.unsubscribe();
                    }
                    if (this.renewSubscription) {
                        this.renewSubscription.unsubscribe();
                    }
                    if (this.notificationSubscription) {
                        this.notificationSubscription.unsubscribe();
                    }
                }
            });
    }

    private observeSessionStatus(): void {
        const VISIBLE_STATE = 'visible';
        const visible = fromEvent(document, 'visibilitychange').pipe(
            map(() => document.visibilityState),
            filter(visibility => visibility === VISIBLE_STATE),
            startWith(VISIBLE_STATE)
        ).subscribe(() => this.renewSubject.next(0));
        this.anchor.add(visible);
    }
}
