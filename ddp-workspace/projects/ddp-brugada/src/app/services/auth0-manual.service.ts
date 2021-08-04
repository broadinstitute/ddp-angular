import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { ConfigurationService } from 'ddp-sdk';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { SignUpResponse } from '../interfaces/auth0';


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
    );
  }
}
