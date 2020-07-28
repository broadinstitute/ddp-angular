import { Component, Inject } from '@angular/core';
import { CookiesManagementService } from '../../../services/cookiesManagement.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
  selector: 'ddp-cookies-banner',
  template: `
  <div class="cookiesBanner">
    <div class="cookiesBanner__text">
      <span translate>SDK.CookiesBanner.Message_First</span>
      <span translate>SDK.CookiesBanner.Message_Second</span>
      <button class="cookiesBanner__link policy"
              (click)="openPolicy()"
              [innerText]="'SDK.CookiesBanner.Policy' | translate"></button>
      <span translate>SDK.CookiesBanner.Message_Third</span>
    </div>
    <button class="cookiesBanner__link"
            (click)="openPreferences()"
            [innerText]="'SDK.CookiesBanner.Preferences' | translate"></button>
    <button class="Button Button--borderedYellow col-lg-4 col-md-4 col-sm-8 col-xs-8"
            (click)="reject()"
            [innerText]="'SDK.CookiesBanner.Reject' | translate">
    </button>
    <button class="Button Button--primaryYellow col-lg-4 col-md-4 col-sm-8 col-xs-8"
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
    this.cookiesService.acceptAll();
    this.cookiesService.closeBanner();
  }

  reject(): void {
    this.cookiesService.rejectNotFunctional();
    this.cookiesService.closeBanner();
  }

  openPreferences(): void {
  }

  openPolicy(): void {
  }
}
