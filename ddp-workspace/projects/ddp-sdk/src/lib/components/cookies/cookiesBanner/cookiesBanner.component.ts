import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ConfigurationService } from '../../../services/configuration.service';
import { CookiesManagementService } from '../../../services/cookiesManagement.service';
import { PrivacyPolicyModalComponent } from '../privacyPolicy/privacyPolicyModal.component';
import { ConsentStatuses } from '../../../models/cookies';

@Component({
  selector: 'ddp-cookies-banner',
  template: `
  <div class="cookiesBanner">
    <div class="cookiesBanner--text">
      <span translate>SDK.CookiesBanner.Text_Before_Policy_Link</span>
      <ddp-privacy-policy-button [logoSrc]="this.logoSrc"
                                 [className]="'cookiesBanner--link policy'"></ddp-privacy-policy-button>
      <span translate>SDK.CookiesBanner.Text_After_Policy_Link</span>
    </div>
    <ddp-cookies-preferences-button [logoSrc]="this.logoSrc"
                                    [text]="'SDK.CookiesBanner.Preferences' | translate"
                                    [className]="'CookieButton--Preferences col-lg-4 col-md-4 col-sm-8 col-xs-8'">
    </ddp-cookies-preferences-button>
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
  @Input() logoSrc: string;

  constructor(private cookiesService: CookiesManagementService,
              public dialog: MatDialog,
              @Inject('ddp.config') private configuration: ConfigurationService) {
  }

  accept(): void {
    this.cookiesService.updatePreferences(ConsentStatuses.defaultAccept);
  }

  reject(): void {
    this.cookiesService.updatePreferences(ConsentStatuses.defaultReject);
  }
}
