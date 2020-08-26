import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NGXTranslateService } from 'ddp-sdk';
import { RedirectToLoginLandingComponent } from "toolkit";

@Component({
  selector: 'toolkit-redirect-to-login-landing',
  template: `
      <ng-container *ngIf="errorText || errorText === ''; then error else auth0">
      </ng-container>
      <ng-template #auth0>
        <ddp-redirect-to-auth0-login>
            <prion-common-landing></prion-common-landing>
        </ddp-redirect-to-auth0-login>
      </ng-template>
      <ng-template #error>
        <toolkit-error [errorText]="errorText"></toolkit-error>
      </ng-template>
  `
})

export class PrionRedirectToLoginLandingComponent extends RedirectToLoginLandingComponent implements OnInit {
  public errorText: string;

  constructor(
    private _route: ActivatedRoute,
    private _translate: NGXTranslateService) {
    super(_route, _translate);
  }
}
