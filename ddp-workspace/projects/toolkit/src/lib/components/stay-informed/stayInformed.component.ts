import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-stay-informed',
    template: `
    <ng-container *ngIf="useRedesign; then newDesign else oldDesign"></ng-container>

    <ng-template #newDesign>
        <main class="main">
            <section class="section static-page-title-section">
                <div class="content content_tight">
                    <h1 translate>Toolkit.StayInformed.Title</h1>
                </div>
            </section>
            <section class="section stay-informed-content-section">
                <div class="content content_tight">
                    <p>
                        <span translate>Toolkit.StayInformed.Text</span>
                        <a [href]="infoEmailHref" class="Link">{{ infoEmail }}</a>.
                    </p>
                    <div class="stay-informed-button">
                        <a routerLink="/" class="button button_medium button_primary" translate>
                            Common.Buttons.ReturnHome
                        </a>
                    </div>
                </div>
            </section>
        </main>
    </ng-template>

    <ng-template #oldDesign>
        <toolkit-header [showButtons]="true"></toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" [innerHTML]="'Toolkit.StayInformed.Title' | translate"></h1>
                        </div>
                    </div>
                </div>
            </div>
            <article class="PageContent">
                <div class="PageLayout">
                    <div class="row NoMargin">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <section class="PageContent-section">
                                <p class="PageContent-text">
                                    <span [innerHTML]="'Toolkit.StayInformed.Text' | translate"></span>
                                    <a [href]="infoEmailHref" class="Link">{{ infoEmail }}</a>.
                                </p>
                                <hr class="HorizontalLine">
                                <div class="row topMarginMedium">
                                    <a class="ButtonFilled Float--right"
                                       [routerLink]="['/']"
                                       [innerHTML]="'Toolkit.StayInformed.ReturnButton' | translate">
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </ng-template>
    `
})
export class StayInformedComponent implements OnInit {
    public infoEmail: string;
    public infoEmailHref: string;
    public useRedesign: boolean;

    constructor(
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
        this.headerConfig.setupDefaultHeader();
    }
}
