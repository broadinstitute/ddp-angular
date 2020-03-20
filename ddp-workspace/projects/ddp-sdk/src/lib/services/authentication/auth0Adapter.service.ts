import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService } from '../sessionMemento.service';
import { LanguageService } from '../languageService.service';
import { WindowRef } from '../windowRef';
import { LoggingService } from '../logging.service';
import { ConfigurationService } from '../configuration.service';
import { GoogleAnalyticsEventsService } from '../googleAnalyticsEvents.service';
import { RenewSessionNotifier } from '../renewSessionNotifier.service';
import { Auth0Mode } from '../../models/auth0-mode';
import { GoogleAnalytics } from '../../models/googleAnalytics';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as auth0 from 'auth0-js';
import * as _ from 'underscore';

/**
 * Main class that handles Auth0 authentication
 */
@Injectable()
export class Auth0AdapterService implements OnDestroy {
    /**
     * Handle to Auth0 library service
     */
    public webAuth: any;
    private ngUnsubscribe = new Subject<any>();

    constructor(
        @Inject('ddp.config') private configuration: ConfigurationService,
        private router: Router,
        private log: LoggingService,
        private session: SessionMementoService,
        private analytics: GoogleAnalyticsEventsService,
        private windowRef: WindowRef,
        private renewNotifier: RenewSessionNotifier,
        private jwtHelper: JwtHelperService,
        private language: LanguageService) {
        const scopes = 'openid profile';
        // TODO Clarify how audience should be used, what is the correct value,etc.
        // TODO refactor and document differences between localregistration flow and "normal" flow
        let audience = 'https://' + this.configuration.auth0Domain;
        if (!_.isUndefined(this.configuration.auth0Audience)) {
            // when using a custom auth0 domain, the audience and domain will differ
            // and the audience needs to be the original name of the tenant
            audience = 'https://' + this.configuration.auth0Audience;
        }
        audience = audience + '/userinfo';
        const doLocalRegistration = configuration.doLocalRegistration;
        if (doLocalRegistration) {
            this.log.logEvent('auth0Adapter', 'issuing code-based auth');
            this.webAuth = new auth0.WebAuth({
                domain: this.configuration.auth0Domain,
                clientID: this.configuration.auth0ClientId,
                studyGuid: this.configuration.studyGuid,
                responseType: 'code',
                audience,
                scope: 'offline_access ' + scopes,
                redirectUri: this.configuration.auth0CodeRedirect
            });
        } else {
            this.log.logEvent('auth0Adapter', 'logging in via token');
            this.webAuth = new auth0.WebAuth({
                domain: this.configuration.auth0Domain,
                clientID: this.configuration.auth0ClientId,
                responseType: 'token id_token',
                audience,
                scope: scopes,
                redirectUri: this.configuration.loginLandingUrl
            });

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

    /**
     * Two modes: signup or login
     */
    private showAuth0Modal(mode: string, additionalAuth0QueryParams?: Record<string, string> | object): void {
        const auth0Params = {
            study_guid: this.configuration.studyGuid,
            mode,
            ...(additionalAuth0QueryParams && additionalAuth0QueryParams)
        };
        this.webAuth.authorize(
            auth0Params,
            () => this.log.logError('auth0Adapter.login', null));
    }

    /**
     * Shows the auth0 modal with the ability to login, but not signup
     */
    public login(additionalParams?: Record<string, string>): void {
        this.showAuth0Modal(Auth0Mode.LoginOnly, additionalParams);
    }

    /**
     * Shows the auth0 modal with the ability to signup, but not login
     */
    public signup(additionalParams?: Record<string, string>): void {
        const temporarySession = this.session.isTemporarySession() ? this.session.session : null;
        const params = {
            ...(temporarySession && {
                temp_user_guid: temporarySession.userGuid
            }),
            ...(additionalParams && {
                ...additionalParams
            }),
            language: this.language.getCurrentLanguage()
        };
        if (this.configuration.doLocalRegistration) {
            sessionStorage.setItem('localAuthParams', JSON.stringify(params));
        }
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
                this.log.logEvent('auth0Adapter.handleAuthentication', authResult);
                this.analytics.emitCustomEvent(GoogleAnalytics.Authentication, GoogleAnalytics.Login);
            } else if (err) {
                this.log.logError('auth0Adapter.handleAuthentication', err);
                let error = null;
                try {
                    error = JSON.parse(decodeURIComponent(err.errorDescription));
                } catch (e) {
                    console.error('Problem decoding authentication error', e);
                }
                if (onErrorCallback && error) {
                    // We might encounter errors from Auth0 that is not in expected
                    // JSON format, so only run callback if decoding is successful.
                    onErrorCallback(error);
                }
            }
        });
    }

    public setSession(authResult): void {
        const decodedJwt = this.jwtHelper.decodeToken(authResult.idToken);
        this.log.logEvent(' authResult', decodedJwt);
        const userGuid = decodedJwt['https://datadonationplatform.org/uid'];

        if (!userGuid) {
            this.log.logError('No user guid found in jwt', decodedJwt);
        } else {
            this.log.logEvent('Logged in user ' + userGuid, null);
        }
        let locale = decodedJwt['locale'];
        if (locale == null) {
            locale = 'en';
        }
        console.log(JSON.stringify(decodedJwt));
        this.session.setSession(
            authResult.accessToken,
            authResult.idToken,
            userGuid,
            locale,
            // the time of expiration in UTC seconds
            decodedJwt['exp'] as number);
        console.log('auth0Adapter successfully updated session token ', decodedJwt);
    }

    public logout(returnToUrl: string = ''): void {
        const baseUrl = this.configuration.baseUrl;
        // Remove tokens and expiry time from localStorage
        this.session.clear();
        this.log.logEvent('auth0Adapter.logout', null);
        this.analytics.emitCustomEvent(GoogleAnalytics.Authentication, GoogleAnalytics.Logout);
        this.webAuth.logout({
            returnTo: `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}${returnToUrl}`,
            clientID: this.configuration.auth0ClientId
        });
    }

    public auth0RenewToken(): void {
        // Original code called renewAuth. This seems to be renewing token correctly
        // Note the response types. 'code' is explicitly not supported
        this.webAuth.checkSession(
            {
                studyGuid: this.configuration.studyGuid,
                responseType: 'token id_token'
            },
            (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('auth0Adapter.renewToken success', result);
                    this.setSession(result);
                }
            });
    }

    public handleExpiredSession(): void {
        if (this.session.isAuthenticatedSessionExpired()) {
            this.handleExpiredAuthenticatedSession();
        } else if (this.session.isTemporarySessionExpired()) {
            this.handleExpiredTemporarySession();
        }
    }

    private handleExpiredAuthenticatedSession(): void {
        this.renewNotifier.hideSessionExpirationNotifications();
        if (!this.configuration.doLocalRegistration) {
            sessionStorage.setItem('nextUrl', this.router.url);
            this.logout('session-expired');
        }
    }

    private handleExpiredTemporarySession(): void {
        this.session.clear();
        window.location.reload();
    }
}
