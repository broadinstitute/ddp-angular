import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionMementoService, LoggingService } from 'ddp-sdk';
import { ToolkitConfigurationService } from './toolkitConfiguration.service';
import { AnalyticsManagementService } from './analyticsManagement.service';
import { CookiesTypes } from '../models/cookies/cookiesType';
import { ConsentStatuses } from '../models/cookies/consentStatuses';
import { CookiesPreferences } from '../models/cookies/cookiesPreferences';
import { CookiesConsentStatuses } from '../models/cookies/cookiesConsentStatuses';

@Injectable()
export class CookiesManagementService {
  private consent: CookiesPreferences;
  private readonly cookiesTypes: Array<CookiesTypes>;
  private readonly cookiesConsentStorageName: string;
  private readonly isAuthenticated: boolean;
  private readonly LOG_SOURCE = 'CookiesManagementService';
  private hasToSetCookiesPreferences: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(@Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService,
              private analytics: AnalyticsManagementService,
              private session: SessionMementoService,
              private logger: LoggingService) {
    this.cookiesTypes = this.config.cookies.data.map(x => x.type).filter(x => x !== 'Functional');
    this.cookiesConsentStorageName = this.config.studyGuid + '_cookies_consent';
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

  private setConsent(): void {
    const localStorageConsent = this.getLocalStorageConsent();
    localStorageConsent ? this.consent = localStorageConsent : this.setDefaultConsent();
  }

  private getLocalStorageConsent(): CookiesPreferences {
    return JSON.parse(localStorage.getItem(this.cookiesConsentStorageName));
  }

  private setDefaultConsent(): void {
    this.consent = { decision: false, status: 'default_reject', cookies: {} };
    this.cookiesTypes.forEach(x => this.consent.cookies[x] = null);
    // analytical cookies are default opt-out
    this.consent.cookies['Analytical'] = false;
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

  private updateConsent(status: CookiesConsentStatuses, cookies?: any): void {
    this.consent.decision = true;
    this.consent.status = status;
    cookies
      ? this.consent.cookies = cookies
      : this.cookiesTypes.forEach(x => this.consent.cookies[x] = status === ConsentStatuses.defaultAccept);
  }

  private logConsentUpdate(): void {
    const loggerEvent = 'Cookies preferences update event occurred. Status: ' + this.consent.status;
    this.logger.logEvent(this.LOG_SOURCE, loggerEvent);
  }
}
