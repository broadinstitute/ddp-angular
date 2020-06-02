import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../services/configuration.service';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { LoggingService } from '../../services/logging.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { WindowRef } from '../../services/windowRef';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ddp-auth0-code-callback',
    template: `<p>Registering with ddp...</p>`
})
export class Auth0CodeCallbackComponent implements OnInit, OnDestroy {
    private LOG_SOURCE = 'Auth0CodeCallback';
    private anchor: Subscription;

    constructor(
        @Inject('ddp.config') private configuration: ConfigurationService,
        private adapter: Auth0AdapterService,
        private session: SessionMementoService,
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
            const registrationPayload = {
                auth0ClientId: this.configuration.auth0ClientId,
                studyGuid: this.configuration.studyGuid,
                auth0Code: authCode,
                redirectUri: this.configuration.auth0CodeRedirect,
                ...(params['temp_user_guid'] && {
                    tempUserGuid: params['temp_user_guid']
                }),
                ...(params['invitation_id'] && {
                    invitationId: params['invitation_id']
                }),
                ...(params['language'] && {
                    languageCode: params['language']
                })
            };

            this.anchor = this.httpClient.post<LocalRegistrationResponse>(this.configuration.localRegistrationUrl, registrationPayload)
                .subscribe(registrationResponse => {
                console.log(registrationResponse);
                this.log.logEvent(this.LOG_SOURCE, 'Now redirecting to ' + this.configuration.loginLandingUrl + ' with id token '
                    + registrationResponse.idToken);
                this.adapter.setSession(registrationResponse);
                this.windowRef.nativeWindow.location.href = this.configuration.loginLandingUrl;
            });
        } else {
            throw new Error('No auth code present in url.');
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
}

interface LocalRegistrationResponse {
    idToken: string;
    accessToken: string;
}
