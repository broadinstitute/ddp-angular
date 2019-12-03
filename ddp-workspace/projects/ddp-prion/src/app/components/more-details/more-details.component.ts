import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'more-details',
    template: `
    <toolkit-header [showButtons]="true"></toolkit-header>
    <div class="Wrapper">
        <div class="PageHeader">
            <div class="PageHeader-background">
                <div class="PageLayout">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <h1 class="PageHeader-title" translate>
                            Toolkit.MoreDetails.Title
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <article class="PageContent">
            <div class="PageLayout row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.MoreDetails.LearnMore.Title</h1>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.LearnMore.WhatIs.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.LearnMore.WhatIs.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.LearnMore.For.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.LearnMore.For.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.LearnMore.Participate.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.LearnMore.Participate.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.LearnMore.Why.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.LearnMore.Why.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.MoreDetails.LearnMore.DoIHaveTo.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.MoreDetails.LearnMore.DoIHaveTo.Text</p>
                    </section>
                </div>
            </div>
        </article>
    </div>    
    `
})
export class MoreDetailsComponent implements OnInit {
    public infoEmail: string;
    public phone: string;
    public infoEmailHref: string;
    public phoneHref: string;
    public countMeInUrl: string;

    constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.infoEmail = this.toolkitConfiguration.infoEmail;
        this.infoEmailHref = `mailto:${this.toolkitConfiguration.infoEmail}`;
        this.phone = this.toolkitConfiguration.phone;
        this.phoneHref = `tel:${this.toolkitConfiguration.phone}`;
        this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
    }
}