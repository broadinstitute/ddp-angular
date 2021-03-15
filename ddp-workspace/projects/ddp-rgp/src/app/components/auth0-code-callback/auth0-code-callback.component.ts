import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  Auth0AdapterService,
  ConfigurationService,
  LoggingService,
  WindowRef,
} from 'ddp-sdk';

import { Routes } from '../../routes';

enum ErrorStatusCode {
  EmailNotVerified = 401,
}

interface Auth0Error {
  code: string;
  statusCode: number;
  message: string;
}

interface LocalRegistrationResponse {
  idToken: string;
  accessToken: string;
}

@Component({
  selector: 'app-auth0-code-callback',
  templateUrl: './auth0-code-callback.component.html',
  styleUrls: ['./auth0-code-callback.component.scss'],
})
export class Auth0CodeCallbackComponent implements OnInit {
  private readonly ERROR_DESCRIPTION = 'error_description';
  private readonly ERROR_CODE = 'code';
  private readonly EMAIL_NOT_VERIFIED_ERROR = 'EMAIL_NOT_VERIFIED';
  private readonly LOG_SOURCE = 'Auth0CodeCallbackComponent';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth0: Auth0AdapterService,
    private loggingService: LoggingService,
    private windowRef: WindowRef,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    try {
      this.checkAuthError();
      this.registerLocally();
    } catch (e) {
      const err: Error = e;

      this.signOut(err.message);
    }
  }

  private checkAuthError(): void {
    const err = this.route.snapshot.queryParamMap.get(this.ERROR_DESCRIPTION);

    if (!err) {
      return;
    }

    const errPayload: Auth0Error = JSON.parse(err);

    if (errPayload.statusCode === ErrorStatusCode.EmailNotVerified) {
      throw new Error(this.EMAIL_NOT_VERIFIED_ERROR);
    } else {
      this.loggingService.logError(
        this.LOG_SOURCE,
        'Received unexpected status code from Auth0',
        errPayload,
      );
    }
  }

  private registerLocally(): void {
    const authCode = this.route.snapshot.queryParamMap.get(this.ERROR_CODE);

    if (!authCode) {
      throw new Error();
    }

    const isAdmin = this.consumeLocalAdminAuth();
    const nextUrl = isAdmin
      ? this.config.adminLoginLandingUrl
      : this.config.loginLandingUrl;
    const payload = this.prepareRegistrationPayload(authCode, isAdmin);

    this.http
      .post<LocalRegistrationResponse>(
        this.config.localRegistrationUrl,
        payload,
      )
      .subscribe(response => {
        this.auth0.setSession(response, isAdmin);
        this.windowRef.nativeWindow.location.href = nextUrl;
      });
  }

  private consumeLocalAuthParams(): Record<string, any> {
    const params = sessionStorage.getItem('localAuthParams') || '{}';

    sessionStorage.removeItem('localAuthParams');

    return JSON.parse(params);
  }

  private consumeLocalAdminAuth(): boolean {
    const item = sessionStorage.getItem('localAdminAuth') || 'false';

    sessionStorage.removeItem('localAdminAuth');

    return JSON.parse(item);
  }

  private prepareRegistrationPayload(
    authCode: string,
    isAdmin: boolean,
  ): Record<string, any> {
    const localParams = this.consumeLocalAuthParams();

    const payload = {
      auth0ClientId: isAdmin
        ? this.config.adminClientId
        : this.config.auth0ClientId,
      studyGuid: this.config.studyGuid,
      auth0Code: authCode,
      redirectUri: this.config.auth0CodeRedirect,
      mode: localParams.mode,
      temp_user_guid: localParams.temp_user_guid,
      invitation_id: localParams.invitation_id,
      time_zone: localParams.time_zone,
      language: localParams.language,
    };

    return payload;
  }

  private signOut(message?: string): void {
    let returnTo: string;

    if (!message) {
      returnTo = Routes.Error;
    } else if (message === this.EMAIL_NOT_VERIFIED_ERROR) {
      returnTo = Routes.EmailVerificationRequired;
    }

    this.auth0.webAuth.logout({
      returnTo: `${this.config.baseUrl}${
        this.config.baseUrl.endsWith('/') ? '' : '/'
      }${returnTo}`,
      clientID: this.config.auth0ClientId,
    });
  }
}
