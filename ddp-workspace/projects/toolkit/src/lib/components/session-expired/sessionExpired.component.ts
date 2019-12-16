import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { Auth0AdapterService } from 'ddp-sdk';

@Component({
    selector: 'toolkit-session-expired',
    template: `
    <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>

    <ng-template #newDesign>
        <main class="main">
            <section class="section session-content-section">
                <div class="content content_tight">
                    <p translate>Toolkit.SessionExpired.Text</p>
                    <div class="session-content-section__button">
                        <button (click)="signin()"
                                class="button button_medium button_primary"
                                translate>
                            Common.Buttons.Login
                        </button>
                    </div>
                </div>
            </section>
        </main>
    </ng-template>

    <ng-template #oldDesign>
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
        </div>
    </ng-template>`
})
export class SessionExpiredComponent implements OnInit {
    public useRedesign: boolean;

    constructor(
        private auth0: Auth0AdapterService,
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
        this.headerConfig.setupDefaultHeader();
    }

    public signin(): void {
        this.auth0.login();
    }
}
