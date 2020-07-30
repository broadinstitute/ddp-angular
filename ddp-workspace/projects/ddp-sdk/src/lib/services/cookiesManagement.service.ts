import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { AnalyticsManagementService } from './analyticsManagement.service';
import { CookiesTypes } from '../models/cookies';

@Injectable()
export class CookiesManagementService {
  private cookiesTypes: Array<CookiesTypes>;
  private readonly policyStorageName: string;
  private hasToSetCookiesPolicy: BehaviorSubject<boolean> =  new BehaviorSubject(null);

  constructor(private cookie: CookieService,
              private analytics: AnalyticsManagementService,
              @Inject('ddp.config') private configuration: ConfigurationService) {
    this.cookiesTypes = this.configuration.cookies.cookies.map(x => x.type).filter(x => x !== 'Functional');
    this.policyStorageName = this.configuration.studyGuid + '_cookies_consent';
  }

  public checkCookiesPolicy(): void {
    if (this.getConsentDecision()) {
      this.hasToSetCookiesPolicy.next(false);
      this.followPolicy();
      return;
    }

    this.checkNeedToSetCookiesPolicy();
    if (this.hasToSetCookiesPolicy && !localStorage.getItem(this.policyStorageName)) {
      this.setDefaultPreferences();
    }
  }

  // if there are other cookies than functional and no consent decision was made and -> need to set Policy
  private checkNeedToSetCookiesPolicy(): void {
    this.cookiesTypes.length && !this.getConsentDecision()
      ? this.hasToSetCookiesPolicy.next(true)
      : this.hasToSetCookiesPolicy.next(false);
  }

  private getConsentDecision(): boolean {
    const policy = JSON.parse(localStorage.getItem(this.policyStorageName));
    return policy ? policy.consent_decision : false;
  }

  private followPolicy(): void {
    const policy = JSON.parse(localStorage.getItem(this.policyStorageName));
    policy.cookies['Analytical'] ? this.analytics.trackAnalytics() : this.analytics.doNotTrackAnalytics();
  }

  private setDefaultPreferences(): void {
    const policy = { consent_decision: false, consent_status: false, cookies: {} };
    this.cookiesTypes.forEach(x => policy.cookies[x] = null);
    localStorage.setItem(this.policyStorageName, JSON.stringify(policy));
  }

  public acceptCookies(): void {
    this.hasToSetCookiesPolicy.next(false);
    this.updateConsentStatus(true);
    if (this.checkDefaultAcceptance())  {
      this.updateCookiesAcceptance(true);
      this.analytics.trackAnalytics();
    }
  }

  public rejectNotFunctionalCookies(): void {
    this.hasToSetCookiesPolicy.next(false);
    this.updateConsentStatus(false);
    this.updateCookiesAcceptance(false);
    this.analytics.doNotTrackAnalytics();
  }

  private updateConsentStatus(value: boolean): void {
    const policy = JSON.parse(localStorage.getItem(this.policyStorageName));
    policy.consent_status = value;
    policy.consent_decision = true;
    localStorage.setItem(this.policyStorageName, JSON.stringify(policy));
  }

  private checkDefaultAcceptance(): boolean {
    const cookiesAcceptance = Object.values(JSON.parse(localStorage.getItem(this.policyStorageName)).cookies);
    return cookiesAcceptance.every(x => x === null);
  }

  private updateCookiesAcceptance(value): void {
    const policy = JSON.parse(localStorage.getItem(this.policyStorageName));
    this.cookiesTypes.forEach(x => policy.cookies[x] = value);
    localStorage.setItem(this.policyStorageName, JSON.stringify(policy));
  }

  public getHasToSetCookiesPolicy(): BehaviorSubject<boolean> {
    return this.hasToSetCookiesPolicy;
  }
}
