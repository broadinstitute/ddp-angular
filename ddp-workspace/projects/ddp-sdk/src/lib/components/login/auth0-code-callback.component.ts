import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { LoggingService } from '../../services/logging.service';
import { WindowRef } from '../../services/windowRef';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ddp-auth0-code-callback',
    template: `<p>Registering with ddp...</p>`
})
export class Auth0CodeCallbackComponent implements OnInit, OnDestroy {
    private LOG_SOURCE = 'Auth0CodeCallbackComponent';
    private anchor: Subscription;

    constructor(
        @Inject('ddp.config') private configuration: ConfigurationService,
        private adapter: Auth0AdapterService,
        private log: LoggingService,
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private windowRef: WindowRef) { }

    public ngOnInit(): void {
        this.log.logEvent(this.LOG_SOURCE, 'post-auth0 callback code for ' + this.windowRef.nativeWindow.location + ':' + location.hash);
        const authCode = this.route.snapshot.queryParams['code'];

        if (authCode) {
            this.log.logEvent(this.LOG_SOURCE, 'Will login to ' + this.configuration.localRegistrationUrl + ' using code ' + authCode);

            const params = this.consumeLocalAuthParams();
            const isAdmin = this.consumeLocalAdminAuth();
            const registrationPayload = {
                auth0ClientId: isAdmin ? this.configuration.adminClientId : this.configuration.auth0ClientId,
                studyGuid: this.configuration.studyGuid,
                auth0Code: authCode,
                redirectUri: this.configuration.auth0CodeRedirect,
                ...(params['mode'] && {
                    mode: params['mode']
                }),
                ...(params['temp_user_guid'] && {
                    tempUserGuid: params['temp_user_guid']
                }),
                ...(params['invitation_id'] && {
                    invitationId: params['invitation_id']
                }),
                ...(params['time_zone'] && {
                    timeZone: params['time_zone']
                }),
                ...(params['language'] && {
                    languageCode: params['language']
                })
            };

            const nextUrl = isAdmin ? this.configuration.adminLoginLandingUrl : this.configuration.loginLandingUrl;
            this.anchor = this.httpClient.post<LocalRegistrationResponse>(this.configuration.localRegistrationUrl, registrationPayload)
                .subscribe(registrationResponse => {
                this.log.logEvent(this.LOG_SOURCE, registrationResponse);
                this.log.logEvent(this.LOG_SOURCE, 'Now redirecting to ' + nextUrl + ' with id token '
                    + registrationResponse.idToken);
                this.adapter.setSession(registrationResponse, isAdmin);
                this.windowRef.nativeWindow.location.href = nextUrl;
            });
        } else {
            const error = this.route.snapshot.queryParams['error'];
            const errorDescription = this.route.snapshot.queryParams['error_description'];
            this.log.logError(this.LOG_SOURCE, 'No auth code present in url');
            this.log.logError(this.LOG_SOURCE, `Error: ${error}`);
            this.log.logError(this.LOG_SOURCE, `Error Description: ${errorDescription}`);
            this.adapter.logout(this.configuration.errorPageUrl);
        }
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    private consumeLocalAuthParams(): object {
        const params = sessionStorage.getItem('localAuthParams') || '{}';
        sessionStorage.removeItem('localAuthParams');
        return JSON.parse(params);
    }

    private consumeLocalAdminAuth(): boolean {
        const item = sessionStorage.getItem('localAdminAuth') || 'false';
        sessionStorage.removeItem('localAdminAuth');
        return JSON.parse(item);
    }
}

interface LocalRegistrationResponse {
    idToken: string;
    accessToken: string;
}
