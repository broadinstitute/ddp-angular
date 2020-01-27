import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'learn-more',
    template: `
    <toolkit-header></toolkit-header>
        <article class="PageContent">
            <div class="PageLayout row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <section class="PageContent-section">
                        <h1 class="PageContent-title" translate>Toolkit.LearnMore.LearnMore.Title</h1>

                        <h2 class="PageContent-subtitle" translate>Toolkit.LearnMore.LearnMore.WhatIs.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.LearnMore.LearnMore.WhatIs.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.LearnMore.LearnMore.For.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.LearnMore.LearnMore.For.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.LearnMore.LearnMore.Participate.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.LearnMore.LearnMore.Participate.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.LearnMore.LearnMore.Why.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.LearnMore.LearnMore.Why.Text</p>

                        <h2 class="PageContent-subtitle" translate>Toolkit.LearnMore.LearnMore.DoIHaveTo.Question</h2>
                        <p class="PageContent-text" translate>Toolkit.LearnMore.LearnMore.DoIHaveTo.Text</p>
                    </section>
                </div>
            </div>
        </article>   
    `
})
export class LearnMoreComponent implements OnInit {
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
