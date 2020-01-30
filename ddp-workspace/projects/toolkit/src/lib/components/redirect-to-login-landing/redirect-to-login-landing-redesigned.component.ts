import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { RedirectToLoginLandingComponent } from './redirect-to-login-landing.component';
import { NGXTranslateService } from 'ddp-sdk';

@Component({
  selector: 'toolkit-redirect-to-login-landing-redesigned',
  template: `
      <ng-container *ngIf="errorText || errorText === ''; then error else auth0">
      </ng-container>
      <ng-template #auth0>
        <ddp-redirect-to-auth0-login>
          <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
        </ddp-redirect-to-auth0-login>
      </ng-template>
      <ng-template #error>
        <toolkit-error-redesigned [errorText]="errorText"></toolkit-error-redesigned>
      </ng-template>
  `
})

export class RedirectToLoginLandingRedesignedComponent extends RedirectToLoginLandingComponent {
  constructor(
    private _route: ActivatedRoute,
    private _translate: NGXTranslateService) {
    super(_route, _translate);
  }
}
