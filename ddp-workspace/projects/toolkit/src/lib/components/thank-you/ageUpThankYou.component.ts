import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
    selector: 'toolkit-age-up-thank-you',
    template: `
    <main class="main">
        <section class="section age-up-email-section">
            <div class="content content_tight">
                <div class="age-up-email-image">
                    <img src="assets/images/email-sent.svg" [alt]="'Toolkit.AgeUpThankYou.ImageAlt' | translate">
                </div>
                <h1 class="age-up-email-title" translate>
                    Toolkit.AgeUpThankYou.Title
                </h1>
                <p *ngIf="isEmailVerified" class="secondary-text" translate>
                    Toolkit.AgeUpThankYou.EmailVerified
                </p>
                <ng-container *ngIf="isEmailCollected">
                    <p class="secondary-text" translate>
                        Toolkit.AgeUpThankYou.EmailCollected.Text
                    </p>
                    <div class="age-up-email-button">
                        <a [routerLink]="dashboardUrl" class="button button_medium button_primary" translate>
                            Toolkit.AgeUpThankYou.EmailCollected.Button
                        </a>
                    </div>
                </ng-container>
            </div>
        </section>
    </main>`
})
export class AgeUpThankYou implements OnInit {
    public isEmailVerified: boolean;
    public isEmailCollected: boolean;
    public dashboardUrl: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.headerConfig.setupDefaultHeader();
        this.isEmailVerified = !!this.activatedRoute.snapshot.data.verify;
        this.isEmailCollected = !!this.activatedRoute.snapshot.data.collect;
        this.dashboardUrl = `/${this.toolkitConfiguration.dashboardUrl}`;
    }
}
