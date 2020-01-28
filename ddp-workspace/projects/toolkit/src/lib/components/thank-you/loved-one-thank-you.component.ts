import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

@Component({
    selector: 'toolkit-loved-one-thank-you',
    template: `
        <toolkit-header [showButtons]="false"></toolkit-header>
        <div class="Wrapper">
            <div class="PageHeader">
                <div class="PageHeader-background">
                    <div class="PageLayout">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <h1 class="PageHeader-title" [innerHTML]="'Toolkit.LovedOneThankYou.Title' | translate"></h1>
                        </div>
                    </div>
                </div>
            </div>

            <article class="PageContent">
                <div class="PageLayout row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <section class="PageContent-section">
                            <p class="PageContent-text" [innerHTML]="'Toolkit.LovedOneThankYou.ThankYou' | translate"></p>
                            <p class="PageContent-text" [innerHTML]="'Toolkit.LovedOneThankYou.StayInTouch' | translate"></p>
                            <p class="PageContent-text">
                                <span [innerHTML]="'Toolkit.LovedOneThankYou.Contacts.TextPt1' | translate"></span>
                                <a [href]="emailHref" class="Link">{{ email }}</a>
                                <span [innerHTML]="'Toolkit.LovedOneThankYou.Contacts.TextPt2' | translate"></span>
                                <a [href]="phoneHref" class="Link">{{ phone }}</a>.
                            </p>
                            <p class="PageContent-text" [innerHTML]="'Toolkit.LovedOneThankYou.ThankYouAgain' | translate">
                            </p>
                        </section>
                    </div>
                </div>
            </article>
        </div>`
})
export class LovedOneThankYouComponent implements OnInit {
    public phone: string;
    public email: string;
    public phoneHref: string;
    public emailHref: string;
    public useRedesign: boolean;

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.phone = this.toolkitConfiguration.phone;
        this.email = this.toolkitConfiguration.infoEmail;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.emailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.useRedesign = this.toolkitConfiguration.enableRedesign;
    }
}
