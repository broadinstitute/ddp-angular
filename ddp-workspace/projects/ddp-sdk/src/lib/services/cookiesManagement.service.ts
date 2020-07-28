import { Inject, Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { BehaviorSubject } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { AnalyticsEventsService } from './analyticsEvents.service';

@Injectable()
export class CookiesManagementService {
  private isFirstTimeVisitor: BehaviorSubject<boolean> =  new BehaviorSubject(null);
  private isCookiesToReject: BehaviorSubject<boolean> =  new BehaviorSubject(null);
  private expireDays = 10;

  constructor(private cookie: CookieService,
              private analytics: AnalyticsEventsService,
              @Inject('ddp.config') private configuration: ConfigurationService) {
  }

  public manageCookies(): void {
    this.checkCookiesStatus();
    this.checkCookiesToReject();
    this.checkFirstTimeCookie();
  }

  private checkCookiesStatus(): void {
    const status = this.cookie.get('consent');
    if (status === null || status === undefined) {
      this.cookie.put('consent', 'false', {expires: this.getExpirationDate()});
    }
  }

  private checkCookiesToReject(): void {
    // If there are cookies other then functional -> they can be rejected -> show banner
    this.configuration.cookies.cookies.filter(x => x.type !== 'Functional').length
      ? this.isCookiesToReject.next(true)
      : this.isCookiesToReject.next(false);
  }

  private checkFirstTimeCookie(): void {
    if (this.cookie.get('isFirstTimeVisitor') === null || this.cookie.get('isFirstTimeVisitor') === undefined) {
      this.cookie.put('isFirstTimeVisitor', 'true', {expires: this.getExpirationDate()});
      this.isFirstTimeVisitor.next(true);
    } else {
      this.cookie.get('isFirstTimeVisitor') === 'true'
        ? this.isFirstTimeVisitor.next(true)
        : this.isFirstTimeVisitor.next(false);
    }
  }

  public getIsCookiesToReject(): BehaviorSubject<boolean> {
    return this.isCookiesToReject;
  }

  public getIsFirstTimeVisitor(): BehaviorSubject<boolean> {
    return this.isFirstTimeVisitor;
  }

  public closeBanner(): void {
    this.cookie.put('isFirstTimeVisitor', 'false', {expires: this.getExpirationDate()});
    this.isFirstTimeVisitor.next(false);
    this.isCookiesToReject.next(false);
  }

  public acceptAll(): void {
    this.cookie.put('consent', 'true', {expires: this.getExpirationDate()});
    this.analytics.startGATracking();
    this.analytics.startTCellTracking();
  }

  public rejectNotFunctional(): void {
    this.cookie.put('consent', 'false', {expires: this.getExpirationDate()});
    this.analytics.doNotTrackGA();
  }

  private getExpirationDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + this.expireDays);
    return date;
  }
}
