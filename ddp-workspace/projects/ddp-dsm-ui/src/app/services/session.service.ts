import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class SessionService {
  static DSM_TOKEN_NAME = 'dsm_token';

  private jwtHelper = new JwtHelperService();
  private isLoggedIn = false;
  private authExpiration: Date;

  constructor() {
    this.isLoggedIn = this.getDSMToken() != null;
  }

  public setDSMToken(value: string): void {
    const expirationDate: Date = this.jwtHelper.getTokenExpirationDate(value);
    this.authExpiration = expirationDate;
    this.isLoggedIn = true;
  }

  public getDSMToken(): string {
    return localStorage.getItem(SessionService.DSM_TOKEN_NAME);
  }

  public getAuthBearerHeaderValue(): string {
    return 'Bearer ' + this.getDSMToken();
  }

  public isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  public logout(): void {
    localStorage.removeItem(SessionService.DSM_TOKEN_NAME);
    this.isLoggedIn = false;
    localStorage.clear();
  }

  public getDSMClaims(value: string): any {
    return this.jwtHelper.decodeToken(value);
  }
}
