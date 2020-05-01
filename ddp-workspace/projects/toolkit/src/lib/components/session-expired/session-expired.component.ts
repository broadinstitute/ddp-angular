import { Component } from '@angular/core';
import { Auth0AdapterService } from 'ddp-sdk';

@Component({
    selector: 'toolkit-session-expired',
    template: `
        <toolkit-header [showButtons]="false"></toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout">
                        <div class="row NoMargin">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <h1 class="PageHeader-title"></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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
                                <button mat-raised-button
                                        color="primary"
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
export class SessionExpiredComponent {
    constructor(private auth0: Auth0AdapterService) { }

    public signin(): void {
        this.auth0.login();
    }
}
