import {
  Component,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrivacyModalData } from "../../models/privacyModalData";

@Component({
  selector: 'ddp-privacy-policy-modal',
  template: `
    <div class="cookiesModal cookiesModal__header">
      <img class="cookiesModal__logo" lazy-resource src="/assets/images/project-logo-dark.svg"
           [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <div *ngIf="data.usePrionTemplate" class="mat-dialog-content">
      <div class="Container">
        <article class="PageContent">
          <div class="PageLayout row">
            <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
              <section class="PageContent-section NoPadding">
                <h1 class="PageContent-title" translate>App.PrivacyPolicy.Title</h1>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Intro.Title</h4>
                <p translate>App.PrivacyPolicy.Intro.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Who.Title</h4>
                <p translate>App.PrivacyPolicy.Who.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Purpose.Title</h4>
                <p translate>App.PrivacyPolicy.Purpose.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Use.Title</h4>
                <p translate>App.PrivacyPolicy.Use.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.HowCollect.Title</h4>
                <p translate>App.PrivacyPolicy.HowCollect.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.WhatCollect.Title</h4>
                <p translate>App.PrivacyPolicy.WhatCollect.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Cookies.Title</h4>
                <p translate>App.PrivacyPolicy.Cookies.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Disabling.Title</h4>
                <p translate>App.PrivacyPolicy.Disabling.Text</p>
                <button>App.PrivacyPolicy.CookiePreferences</button>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Tracking.Title</h4>
                <p translate>App.PrivacyPolicy.Tracking.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.DoNotTrack.Title</h4>
                <p translate>App.PrivacyPolicy.DoNotTrack.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.HowUse.Title</h4>
                <p translate>App.PrivacyPolicy.HowUse.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.ShareWith.Title</h4>
                <p translate>App.PrivacyPolicy.ShareWith.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.ThirdParty.Title</h4>
                <p translate>App.PrivacyPolicy.ThirdParty.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.OtherUsers.Title</h4>
                <p translate>App.PrivacyPolicy.OtherUsers.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.InformationRights.Title</h4>
                <p translate>App.PrivacyPolicy.InformationRights.Text.P1</p>
                <button>App.PrivacyPolicy.DataRequest</button>
                <p translate>App.PrivacyPolicy.InformationRights.Text.P2</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Security.Title</h4>
                <p translate>App.PrivacyPolicy.Security.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Children.Title</h4>
                <p translate>App.PrivacyPolicy.Children.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Country.Title</h4>
                <p translate>App.PrivacyPolicy.Country.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Contact.Title</h4>
                <p translate>App.PrivacyPolicy.Contact.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Update.Title</h4>
                <p translate>App.PrivacyPolicy.Update.Text</p>
                <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.EU.Title</h4>
                <p translate>App.PrivacyPolicy.EU.Text</p>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
    <div *ngIf="!data.usePrionTemplate">
      <p>Please specify your template here...</p>
    </div>
  `,
})
export class PrivacyPolicyModalComponent {
  constructor(public dialogRef: MatDialogRef<PrivacyPolicyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PrivacyModalData) {
  }

  close(): void {
    this.dialogRef.close();
  }
}
