import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})
export class SessionService {
  static DSM_TOKEN_NAME = 'dsm_token';

  private jwtHelper = new JwtHelperService();
  private isLoggedIn = false;
  private authExpiration: Date;

  constructor() {
    this.isLoggedIn = this.getDSMToken() != null;
  }

  public setDSMToken(token: string): void {
    localStorage.setItem(SessionService.DSM_TOKEN_NAME, token);
    this.isLoggedIn = true;
    this.setExpirationTime(token);
  }

  public setExpirationTime(token: string): void {
    this.authExpiration = this.jwtHelper.getTokenExpirationDate(token);
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
    this.isLoggedIn = false;
  }

  public getDSMClaims(value: string): any {
    return this.jwtHelper.decodeToken(value);
  }

  getTokenExpiration(): Date {
    return this.authExpiration;
  }
}
