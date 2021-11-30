import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../internationalization/languageService.service';
import { WindowRef } from '../windowRef';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { AnalyticsEventsService } from '../analyticsEvents.service';
import { RenewSessionNotifier } from '../renewSessionNotifier.service';
import { Auth0Mode } from '../../models/auth0-mode';
import { AnalyticsEventCategories } from '../../models/analyticsEventCategories';
import { AnalyticsEventActions } from '../../models/analyticsEventActions';
import { JwtHelperService } from '@auth0/angular-jwt';
import { bindNodeCallback, Observable, Subject } from 'rxjs';
import { takeUntil, take, tap, mergeMap } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import * as _ from 'underscore';
import { Session } from '../../models/session';

/**
 * Main class that handles Auth0 authentication
 */
@Injectable()
export class Auth0AdapterService implements OnDestroy {
    /**
     * Handle to Auth0 library service
     */
    public webAuth: any;
    public adminWebAuth: any | null;
    private ngUnsubscribe = new Subject<any>();
    private isAdminSession = false;
    private readonly LOG_SOURCE = 'Auth0AdapterService';

    constructor(
        @Inject('ddp.config') private configuration: ConfigurationService,
        private router: Router,
        private log: LoggingService,
        private session: SessionMementoService,
        private analytics: AnalyticsEventsService,
        private windowRef: WindowRef,
        private renewNotifier: RenewSessionNotifier,
        private jwtHelper: JwtHelperService,
        private language: LanguageService) {
        const doLocalRegistration = configuration.doLocalRegistration;
        if (doLocalRegistration) {
            this.log.logEvent(this.LOG_SOURCE, 'issuing code-based auth');
            this.webAuth = this.createLocalWebAuth(this.configuration.auth0ClientId);
            if (this.configuration.adminClientId !== null) {
                this.adminWebAuth = this.createLocalWebAuth(this.configuration.adminClientId);
            }
        } else {
            this.log.logEvent(this.LOG_SOURCE, 'logging in via token');
            this.webAuth = this.createWebAuth(this.configuration.auth0ClientId, this.configuration.loginLandingUrl);
            if (this.configuration.adminClientId !== null) {
                this.adminWebAuth = this.createWebAuth(this.configuration.adminClientId, this.configuration.adminLoginLandingUrl);
            }
        }
        this.session.renewObservable
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.handleExpiredSession());
        this.session.notificationObservable
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(() => this.renewNotifier.showSessionExpirationNotifications());
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private createWebAuth(clientId: string, redirectUri: string): any {
        // TODO Clarify how audience should be used, what is the correct value,etc.
        // TODO refactor and document differences between localregistration flow and "normal" flow
        let audience = 'https://' + this.configuration.auth0Domain;
        if (!_.isUndefined(this.configuration.auth0Audience)) {
            // when using a custom auth0 domain, the audience and domain will differ
            // and the audience needs to be the original name of the tenant
            audience = 'https://' + this.configuration.auth0Audience;
        }
        audience = audience + '/userinfo';
        return new auth0.WebAuth({
            domain: this.configuration.auth0Domain,
            clientID: clientId,
            responseType: 'token id_token',
            audience,
            scope: 'openid profile',
            redirectUri
        });
    }

    private createLocalWebAuth(clientId: string): any {
        // TODO see audience in createWebAuth()
        let audience = 'https://' + this.configuration.auth0Domain;
        if (!_.isUndefined(this.configuration.auth0Audience)) {
            audience = 'https://' + this.configuration.auth0Audience;
        }
        audience = audience + '/userinfo';
        return new auth0.WebAuth({
            domain: this.configuration.auth0Domain,
            clientID: clientId,
            studyGuid: this.configuration.studyGuid,
            responseType: 'code',
            audience,
            scope: 'offline_access openid profile',
            redirectUri: this.configuration.auth0CodeRedirect
        });
    }

    /**
     * Two modes: signup or login
     */
    private showAuth0Modal(mode: string, additionalAuth0QueryParams?: Record<string, string> | object): void {
        const auth0Params = {
            study_guid: this.configuration.studyGuid,
            mode,
            ...(additionalAuth0QueryParams && additionalAuth0QueryParams)
        };
        if (this.configuration.doLocalRegistration) {
            sessionStorage.setItem('localAdminAuth', 'false');
            sessionStorage.setItem('localAuthParams', JSON.stringify(auth0Params));
        }
        this.webAuth.authorize(
            auth0Params,
            () => this.log.logError(`${this.LOG_SOURCE}.showAuth0Modal`, 'auth0 error'));
    }

    /**
     * Shows the auth0 modal with the ability to login, but not signup
     */
    public login(additionalParams?: Record<string, string>): void {
        const params = {
            ...(additionalParams && {
                ...additionalParams
            }),
            language: this.language.getCurrentLanguage()
        };
        this.log.logToCloud(`Auth0 login modal is open: ${JSON.stringify(params)}`, { auth0Mode: Auth0Mode.LoginOnly });
        this.showAuth0Modal(Auth0Mode.LoginOnly, params);
    }

    /**
     * Shows the auth0 modal with the ability to signup, but not login
     */
    public signup(additionalParams?: Record<string, string>): void {
        const temporarySession = this.session.isTemporarySession() ? this.session.session : null;
        if (!temporarySession || !temporarySession.userGuid) {
            this.log.logError(`${this.LOG_SOURCE}.signup.No temporal user guid`);
        }
        const params = {
            ...(temporarySession && {
                temp_user_guid: temporarySession.userGuid
            }),
            ...(additionalParams && {
                ...additionalParams
            }),
            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
            language: this.language.getCurrentLanguage(),
            // @todo : hack delete when done
            serverUrl: this.configuration.backendUrl
        };
        this.log.logToCloud(`Auth0 signup modal is open for user: ${JSON.stringify(params)}`, { auth0Mode: Auth0Mode.SignupOnly });
        this.showAuth0Modal(Auth0Mode.SignupOnly, params);
    }

    /**
     * Shows the auth0 modal with the ability to signup and login
     */
    public signupOrLogin(additionalParams?: Record<string, string>): void {
        this.showAuth0Modal(Auth0Mode.SignupAndLogin, additionalParams);
    }

    /**
     * Process the result from Auth0 authentication. When successful, we set the auth session.
     * If there was an error, the callback is invoked with additional error info decoded from
     * Auth0. If decoding fails, null is passed to callback.
     */
    public handleAuthentication(onErrorCallback?: (e: any | null) => void): void {
        this.webAuth.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.windowRef.nativeWindow.location.hash = '';
                this.setSession(authResult);
                this.log.logEvent(`${this.LOG_SOURCE}.handleAuthentication`, authResult);
                this.log.logToCloud(`${this.LOG_SOURCE}.handleAuthentication, authResult: ${JSON.stringify(authResult)}`);
                this.analytics.emitCustomEvent(AnalyticsEventCategories.Authentication, AnalyticsEventActions.Login);
            } else if (err) {
                this.log.logError(`${this.LOG_SOURCE}.handleAuthentication`, err);
                let error = null;
                try {
                    error = JSON.parse(decodeURIComponent(err.errorDescription));
                } catch (e) {
                    this.log.logError(`${this.LOG_SOURCE}.handleAuthentication.Problem decoding authentication error`, e);
                }
                if (onErrorCallback && error) {
                    // We might encounter errors from Auth0 that is not in expected
                    // JSON format, so only run callback if decoding is successful.
                    onErrorCallback(error);
                }
            }
        });
    }

    public adminLogin(additionalParams?: Record<string, string>): void {
        const auth0Params = {
            study_guid: this.configuration.studyGuid,
            mode: Auth0Mode.LoginOnly,
            is_admin_client: true,
            ...(additionalParams && additionalParams)
        };
        if (this.configuration.doLocalRegistration) {
            sessionStorage.setItem('localAdminAuth', 'true');
            sessionStorage.setItem('localAuthParams', JSON.stringify(auth0Params));
        }
        this.adminWebAuth.authorize(
            auth0Params,
            () => this.log.logError(`${this.LOG_SOURCE}.adminLogin`, 'auth0 error'));
    }

    public handleAdminAuthentication(onErrorCallback?: (e: any | null) => void): void {
        const options = {
            __enableIdPInitiatedLogin: true
        };
        this.adminWebAuth.parseHash(options, (err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.windowRef.nativeWindow.location.hash = '';
                this.setSession(authResult, true);
                this.log.logEvent(`${this.LOG_SOURCE}.handleAdminAuthentication`, authResult);
                this.analytics.emitCustomEvent(AnalyticsEventCategories.Authentication, AnalyticsEventActions.Login);
            } else if (err) {
                this.log.logError(`${this.LOG_SOURCE}.handleAdminAuthentication`, err);
                if (onErrorCallback) {
                    // Let callback handle whether to decode error or not.
                    onErrorCallback(err.errorDescription);
                }
            }
        });
    }

    public setSession(authResult, isAdmin: boolean = false): void {
        const decodedJwt = this.jwtHelper.decodeToken(authResult.idToken);
        this.log.logEvent(this.LOG_SOURCE, `authResult: ${decodedJwt}`);
        this.log.logToCloud(`${this.LOG_SOURCE} authResult: ${JSON.stringify(decodedJwt)}`);
        const userGuid = decodedJwt['https://datadonationplatform.org/uid'];

        if (!userGuid) {
            this.log.logError(this.LOG_SOURCE, `No user guid found in jwt: ${JSON.stringify(decodedJwt)}`);
        } else {
            this.log.logEvent(this.LOG_SOURCE, `Logged in user: ${userGuid}`);
            this.log.logToCloud(`${this.LOG_SOURCE} Logged in user ${userGuid}`, { userGuid });
        }
        let locale = decodedJwt['locale'];
        if (locale == null) {
            locale = this.language.getAppLanguageCode();
        }
        this.session.setSession(
            authResult.accessToken,
            authResult.idToken,
            userGuid,
            locale,
            // the time of expiration in UTC seconds
            decodedJwt['exp'] as number,
            authResult.participantGuid,
            isAdmin);
        this.isAdminSession = isAdmin;
        this.log.logEvent(this.LOG_SOURCE,
            `Successfully updated session token: ${JSON.stringify(decodedJwt)}`);
        this.log.logToCloud(`${this.LOG_SOURCE} Successfully updated session token: ${JSON.stringify(decodedJwt)}`);
    }

    public logout(returnToUrl: string = ''): void {
        const baseUrl = this.configuration.baseUrl;
        this.log.logToCloud(`${this.LOG_SOURCE} logout for user`);
        // Remove tokens and expiry time from localStorage
        this.session.clear();
        this.log.logEvent(this.LOG_SOURCE, 'logout');
        this.analytics.emitCustomEvent(AnalyticsEventCategories.Authentication, AnalyticsEventActions.Logout);

        let returnTo = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${returnToUrl}`;
        if (returnToUrl.startsWith('http')) {
          returnTo = returnToUrl;
        }

        if (this.isAdminSession) {
            this.adminWebAuth.logout({
                returnTo,
                clientID: this.configuration.adminClientId
            });
        } else {
            this.webAuth.logout({
                returnTo,
                clientID: this.configuration.auth0ClientId
            });
        }
    }

    public auth0RenewToken(): Observable<Session | null> {
        const currentSession = this.session.session;
        const studyGuid = this.configuration.studyGuid;
        const auth0IdToken = this.jwtHelper.decodeToken(currentSession.idToken)['sub'];
        const clientId = currentSession.isAdmin ? this.configuration.adminClientId : this.configuration.auth0ClientId;
        const resultMatchesThisSession = (result: any) => {
            const resultClientId: any = result.idTokenPayload['https://datadonationplatform.org/cid'];
            return result.idTokenPayload['sub'] === auth0IdToken && resultClientId && resultClientId === clientId;
        };
        const auth0Instance = currentSession.isAdmin ? this.adminWebAuth : this.webAuth;
        const checkSession$ = bindNodeCallback(cb => auth0Instance.checkSession({
            studyGuid,
            responseType: 'token id_token',
            renew_token_only: true // this flag will indicate that Auth0 should not try to call user registration
        }, cb));
        return checkSession$().pipe(
            take(1),
            tap(result => {
                if (resultMatchesThisSession(result)) {
                    this.renewSession(result);
                } else {
                    throw new Error('Token received does not match this session');
                }
            }),
            tap(() => this.renewNotifier.hideSessionExpirationNotifications()),
            mergeMap(() => this.session.sessionObservable.pipe(take(1)))
        );
    }

    public renewSession(renewalAuthResult): void {
        const decodedJwt = this.jwtHelper.decodeToken(renewalAuthResult.idToken);
        const oldSession = this.session.session;
        this.log.logToCloud(`${this.LOG_SOURCE} renewSession with token: ${renewalAuthResult.accessToken}`,
            { userGuid: oldSession.userGuid });
        this.session.setSession(
            renewalAuthResult.accessToken,
            renewalAuthResult.idToken,
            oldSession.userGuid,
            oldSession.locale,
            // the time of expiration in UTC seconds
            decodedJwt['exp'] as number,
            oldSession.participantGuid,
            oldSession.isAdmin);
    }

    public handleExpiredSession(): void {
        if (this.session.isAuthenticatedSessionExpired()) {
            this.handleExpiredAuthenticatedSession();
        } else if (this.session.isTemporarySessionExpired()) {
            this.handleExpiredTemporarySession();
        }
    }

    public handleExpiredAuthenticatedSession(): void {
        const returnToUrl = this.getSessionExpiredUrl();
        this.renewNotifier.hideSessionExpirationNotifications();
        sessionStorage.setItem('nextUrl', this.router.url);
        this.logout(returnToUrl);
    }

    private handleExpiredTemporarySession(): void {
        this.log.logToCloud(`${this.LOG_SOURCE} expired temporary session`);
        this.session.clear();
        window.location.reload();
    }

    private getSessionExpiredUrl(): string {
        return this.isAdminSession ?
            this.configuration.adminSessionExpiredUrl : this.configuration.sessionExpiredUrl;
    }
}
