import { Observable } from 'rxjs';
import * as auth0 from 'auth0-js';
import { tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ConfigurationService } from '../config/configuration.service';
import { Auth0LoginErrorResponse, SignUpResponse } from '../interfaces/auth0';


@Injectable({
  providedIn: 'root'
})
export class Auth0ManualService {
  constructor(
    private readonly httpClient: HttpClient,
    @Inject('ddp.config') private readonly config: ConfigurationService
  ) {}

  signUp({ email, password, firstName, lastName }: User): Observable<SignUpResponse> {
    return this.httpClient.post<SignUpResponse>(
      `https://${this.config.auth0Domain}/dbconnections/signup`,
      {
        email,
        password,
        given_name: firstName,
        family_name: lastName,
        connection: this.config.dbName,
        client_id: this.config.auth0ClientId
      }
    ).pipe(
      tap(() => this.login({ email, password }))
    );
  }

  login(
    { email: username, password }: User,
    errorHandler: (err: Auth0LoginErrorResponse) => void = () => {}
  ): void {
    const webAuth = new auth0.WebAuth({
      scope: this.config.auth0Scope,
      domain: this.config.auth0Domain,
      studyGuid: this.config.studyGuid,
      clientID: this.config.auth0ClientId,
      redirectUri: this.config.auth0CodeRedirect,
      responseType: this.config.auth0ResponseType
    });

    webAuth.login(
      {
        username,
        password,
        realm: this.config.dbName
      },
      errorHandler
    );
  }
}
