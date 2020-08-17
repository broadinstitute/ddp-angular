import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { LoggingService } from '../../services/logging.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { WindowRef } from '../../services/windowRef';
import { Subscription } from 'rxjs';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'ddp-auth0-code-callback',
    template: `<p>Registering with ddp...</p>`
})
export class Auth0CodeCallbackComponent implements OnInit, OnDestroy {
    private LOG_SOURCE = 'Auth0CodeCallback';
    private anchor: Subscription = null;

    constructor(
        @Inject('ddp.config') private configuration: ConfigurationService,
        private adapter: Auth0AdapterService,
        private session: SessionMementoService,
        private log: LoggingService,
        private httpClient: HttpClient,
        private route: ActivatedRoute,
        private windowRef: WindowRef,
        private router: Router) { }

    public ngOnInit(): void {
        this.log.logEvent(this.LOG_SOURCE, 'post-auth0 callback code for ' + this.windowRef.nativeWindow.location + ':' + location.hash);
        const authError = this.route.snapshot.queryParams['error'];
       if (authError) {
         const authErrorDescription = this.route.snapshot.queryParams['error_description'];
         if (JSON.parse(authErrorDescription).code === 'unauthorized') {
           this.router.navigateByUrl('account-activation-required');
           return;
         }
       }
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
                console.log(registrationResponse);
                this.log.logEvent(this.LOG_SOURCE, 'Now redirecting to ' + nextUrl + ' with id token '
                    + registrationResponse.idToken);
                this.adapter.setSession(registrationResponse, isAdmin);
                this.windowRef.nativeWindow.location.href = nextUrl;
            });
        } else {
            throw new Error('No auth code present in url.');
        }
    }

    public ngOnDestroy(): void {
      if (!!this.anchor) {
        this.anchor.unsubscribe();
      }
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
