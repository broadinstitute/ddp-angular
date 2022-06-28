import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Auth0AdapterService, LanguageService, SessionMementoService } from 'ddp-sdk';

import { Auth0LoginErrorResponse, SignUpResponse } from '../interfaces/auth0';
import { User } from '../interfaces/user';
import { ConfigurationService } from '../config/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class Auth0ManualService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly auth0AdapterService: Auth0AdapterService,
    private readonly sessionService: SessionMementoService,
    private readonly languageService: LanguageService,
    @Inject('ddp.config') private readonly config: ConfigurationService,
  ) {}

  signUp({ email, password, firstName, lastName }: User): Observable<SignUpResponse> {
    let userMetadata: Record<string, any> = {
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      language: this.languageService.getCurrentLanguage(),
    };

    if (this.sessionService.isTemporarySession()) {
      userMetadata = {
        ...userMetadata,
        temp_user_guid: this.sessionService.session?.userGuid,
      };
    }

    if (this.config.doLocalRegistration) {
      sessionStorage.setItem('localAdminAuth', 'false');
      sessionStorage.setItem('localAuthParams', JSON.stringify(userMetadata));
    }

    return this.httpClient
      .post<SignUpResponse>(`https://${this.config.auth0Domain}/dbconnections/signup`, {
        email,
        password,
        given_name: firstName,
        family_name: lastName,
        connection: this.config.dbName,
        client_id: this.config.auth0ClientId,
        user_metadata: userMetadata,
      })
      .pipe(tap(() => this.login({ email, password })));
  }

  login({ email: username, password }: User, errorHandler: (err: Auth0LoginErrorResponse) => void = () => {}): void {
    this.auth0AdapterService.webAuth.login(
      {
        username,
        password,
        realm: this.config.dbName,
      },
      errorHandler,
    );
  }

  resetPassword(email: string): Observable<string> {
    return this.httpClient.post(
      `https://${this.config.auth0Domain}/dbconnections/change_password`,
      {
        email,
        connection: this.config.dbName,
        client_id: this.config.auth0ClientId,
      },
      {
        responseType: 'text',
      },
    );
  }
}
