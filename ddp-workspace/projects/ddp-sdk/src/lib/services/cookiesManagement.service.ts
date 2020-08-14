import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { AnalyticsManagementService } from './analyticsManagement.service';
import { ConsentStatuses, CookiesConsentStatuses, CookiesPreferences, CookiesTypes } from '../models/cookies';
import { SessionMementoService } from './sessionMemento.service';
import { LoggingService } from './logging.service';

@Injectable()
export class CookiesManagementService {
  private consent: CookiesPreferences;
  private readonly cookiesTypes: Array<CookiesTypes>;
  private readonly cookiesConsentStorageName: string;
  private readonly isAuthenticated: boolean;
  private hasToSetCookiesPreferences: BehaviorSubject<boolean> =  new BehaviorSubject(null);

  constructor(private analytics: AnalyticsManagementService,
              @Inject('ddp.config') private configuration: ConfigurationService,
              private session: SessionMementoService,
              private logger: LoggingService) {
    this.cookiesTypes = this.configuration.cookies.cookies.map(x => x.type).filter(x => x !== 'Functional');
    this.cookiesConsentStorageName = this.configuration.studyGuid + '_cookies_consent';
    this.isAuthenticated = this.session.isAuthenticatedSession();
  }

  public checkCookiesConsent(): void {
    // if no cookies to reject -> do nothing
    if (this.cookiesTypes.length === 0) {
      return;
    }

    this.setConsent();

    if (this.consent.decision) {
      this.dismissBanner();
      this.followConsent();
      return;
    } else {
      this.showBanner();
    }
  }

  private setConsent(): void {
    const localStorageConsent = this.getLocalStorageConsent();
    localStorageConsent ? this.consent = localStorageConsent : this.setDefaultConsent();
  }

  private getLocalStorageConsent(): CookiesPreferences   {
    return JSON.parse(localStorage.getItem(this.cookiesConsentStorageName));
  }

  private setDefaultConsent(): void {
    this.consent = { decision: false, status: 'default_reject', cookies: {} };
    this.cookiesTypes.forEach(x => this.consent.cookies[x] = null);
    this.updateLocalStorageConsent();
  }

  private updateLocalStorageConsent(): void {
    localStorage.setItem(this.cookiesConsentStorageName, JSON.stringify(this.consent));
  }

  private followConsent(): void {
    this.consent.cookies['Analytical'] ? this.analytics.trackAnalytics() : this.analytics.doNotTrackAnalytics();
  }

  private dismissBanner(): void {
    this.hasToSetCookiesPreferences.next(false);
  }

  private showBanner(): void {
    this.hasToSetCookiesPreferences.next(true);
  }

  public getHasToSetCookiesPreferences(): BehaviorSubject<boolean> {
    return this.hasToSetCookiesPreferences;
  }

  public getCurrentCookiesAcceptance(): any {
    return this.consent.cookies;
  }

  public updatePreferences(status: CookiesConsentStatuses, cookies?: any): void {
    this.dismissBanner();
    this.updateConsent(status, cookies);
    this.updateLocalStorageConsent();
    this.followConsent();
    this.logConsentUpdate();
  }

  private updateConsent(status: CookiesConsentStatuses, cookies?: any): void {
    this.consent.decision = true;
    this.consent.status = status;
    cookies
      ? this.consent.cookies = cookies
      : this.cookiesTypes.forEach(x => this.consent.cookies[x] = status === ConsentStatuses.defaultAccept);
  }

  private logConsentUpdate(): void {
    const loggerEvent = 'Cookies preferences update event occured. Status: ' + this.consent.status;
    this.logger.logEvent('Cookies Management Service', loggerEvent);
  }
}
