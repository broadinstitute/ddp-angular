import { Component } from '@angular/core';
import { Auth0AdapterService } from 'ddp-sdk';
import { SessionExpiredComponent } from "toolkit";

@Component({
  selector: 'toolkit-session-expired',
  template: `
        <toolkit-header></toolkit-header>
        <div class="Wrapper">
        <article class="PageContent">
            <div class="PageLayout">
            <div class="row NoMargin">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <section class="PageContent-section">
                    <p class="PageContent-text" translate>
                    Toolkit.SessionExpired.Text.Pt1
                    </p>
                    <p class="PageContent-text" translate>
                    Toolkit.SessionExpired.Text.Pt2
                    </p>
                    <button mat-raised-button color="primary"
                    class="margin-5 ButtonFilled"
                    (click)="signin()"
                    [innerHTML]="'Toolkit.SessionExpired.LogInButton' | translate">
                    </button>
                </section>
                </div>
            </div>
            </div>
        </article>
        </div>`
})
export class PrionSessionExpiredComponent extends SessionExpiredComponent {
  constructor(private _auth0: Auth0AdapterService) {
    super(_auth0);
  }
}
