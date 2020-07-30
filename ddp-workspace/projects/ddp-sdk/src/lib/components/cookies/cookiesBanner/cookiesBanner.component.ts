import { Component, Inject } from '@angular/core';
import { CookiesManagementService } from '../../../services/cookiesManagement.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from '../../../services/configuration.service';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { CookiesPreferencesModalComponent } from '../cookiesPreferencesModal/cookiesPreferencesModal.component';
import { PrivacyPolicyModalComponent } from '../privacyPolicy/privacyPolicyModal.component';

@Component({
  selector: 'ddp-cookies-banner',
  template: `
  <div class="cookiesBanner">
    <div class="cookiesBanner--text">
      <span translate>SDK.CookiesBanner.Text_Before_Policy_Link</span>
      <button class="cookiesBanner--link policy"
              (click)="openPolicy()"
              [innerText]="'SDK.CookiesBanner.Policy' | translate"></button>
      <span translate>SDK.CookiesBanner.Text_After_Policy_Link</span>
    </div>
    <button class="cookiesBanner--link"
            (click)="openPreferences()"
            [innerText]="'SDK.CookiesBanner.Preferences' | translate"></button>
    <button class="Button CookieButton--Reject col-lg-4 col-md-4 col-sm-8 col-xs-8"
            (click)="reject()"
            [innerText]="'SDK.CookiesBanner.Reject' | translate">
    </button>
    <button class="Button CookieButton--Accept col-lg-4 col-md-4 col-sm-8 col-xs-8"
            (click)="accept()"
            [innerText]="'SDK.CookiesBanner.Accept' | translate">
    </button>
  </div>`
})
export class CookiesBannerComponent {
  constructor(private cookiesService: CookiesManagementService,
              public dialog: MatDialog,
              @Inject('ddp.config') private configuration: ConfigurationService) {
  }

  accept(): void {
    this.cookiesService.acceptCookies();
  }

  reject(): void {
    this.cookiesService.rejectNotFunctionalCookies();
  }

  openPreferences(): void {
    this.dialog.open(CookiesPreferencesModalComponent, {
      width: '740px',
      data: this.configuration.cookies,
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }

  openPolicy(): void {
    this.dialog.open(PrivacyPolicyModalComponent, {
      width: '740px',
      data: {},
      autoFocus: false,
      disableClose: false,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
