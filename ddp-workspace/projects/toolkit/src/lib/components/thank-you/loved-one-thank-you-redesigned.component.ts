import { Component, Inject, OnInit } from '@angular/core';
import { LovedOneThankYouComponent } from './loved-one-thank-you.component';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';

@Component({
    selector: 'toolkit-loved-one-thank-you-redesigned',
    template: `
        <main class="main">
            <section class="section static-page-title-section">
                <div class="content content_tight">
                <h1 translate>Toolkit.LovedOneThankYou.Title</h1>
                </div>
            </section>
            <section class="section loved-one-thank-you-content-section">
                <div class="content content_tight">
                    <p translate>Toolkit.LovedOneThankYou.ThankYou</p>
                    <p translate>Toolkit.LovedOneThankYou.StayInTouch</p>
                    <p>
                        <span translate>Toolkit.LovedOneThankYou.Contacts.TextPt1</span>
                        <a [href]="emailHref" class="Link">{{ email }}</a>
                        <span translate>Toolkit.LovedOneThankYou.Contacts.TextPt2</span>
                        <a [href]="phoneHref" class="Link">{{ phone }}</a>.
                    </p>
                    <p translate>Toolkit.LovedOneThankYou.ThankYouAgain</p>
                </div>
            </section>
        </main>`
})
export class LovedOneThankYouRedesignedComponent extends LovedOneThankYouComponent implements OnInit {
    constructor(
        private headerConfig: HeaderConfigurationService,
        @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
        super(_toolkitConfiguration);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.headerConfig.setupDefaultHeader();
    }
}
