import { Component } from '@angular/core';
import { CookiesManagementService } from '../../../services/cookiesManagement.service';
import { ConsentStatuses } from '../../../models/cookies';

@Component({
  selector: 'ddp-cookies-banner',
  template: `
  <div class="cookiesBanner">
    <div class="cookiesBanner--text">
      <span translate>SDK.CookiesBanner.Text_Before_Policy_Link</span>
      <ddp-privacy-policy-button [className]="'cookiesBanner--link policy'"></ddp-privacy-policy-button>
      <span translate>SDK.CookiesBanner.Text_After_Policy_Link</span>
    </div>
    <ddp-cookies-preferences-button [className]="'CookieButton--Preferences col-lg-4 col-md-4 col-sm-8 col-xs-8'"
                                    [privacyPolicyLink]="true">
    </ddp-cookies-preferences-button>
    <button class="Button CookieButton--Reject col-lg-4 col-md-4 col-sm-8 col-xs-8"
            (click)="cookiesService.updatePreferences(statuses.defaultReject)"
            [innerText]="'SDK.CookiesBanner.Reject' | translate">
    </button>
    <button class="Button CookieButton--Accept col-lg-4 col-md-4 col-sm-8 col-xs-8"
            (click)="cookiesService.updatePreferences(statuses.defaultAccept)"
            [innerText]="'SDK.CookiesBanner.Accept' | translate">
    </button>
  </div>`
})
export class CookiesBannerComponent {
  public statuses = ConsentStatuses;

  constructor(public cookiesService: CookiesManagementService) {
  }
}
