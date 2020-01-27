import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
    selector: 'learn-more',
    template: `
    <toolkit-header currentRoute="/learn-more"></toolkit-header>
    <div class="Container">
      <article class="PageContent">
        <div class="PageLayout row">
          <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
            <section class="PageContent-section NoPadding">
              <h1 class="PageContent-title" translate>Toolkit.LearnMore.LearnMore.Title</h1>

              <h4 class="Subtitle Color--green" translate>Toolkit.LearnMore.LearnMore.WhatIs.Question</h4>
              <p translate>Toolkit.LearnMore.LearnMore.WhatIs.Text</p>

              <h4 class="Subtitle Color--green" translate>Toolkit.LearnMore.LearnMore.For.Question</h4>
              <p translate>Toolkit.LearnMore.LearnMore.For.Text</p>

              <h4 class="Subtitle Color--green" translate>Toolkit.LearnMore.LearnMore.Participate.Question</h4>
              <p translate>Toolkit.LearnMore.LearnMore.Participate.Text</p>

              <h4 class="Subtitle Color--green" translate>Toolkit.LearnMore.LearnMore.Why.Question</h4>
              <p translate>Toolkit.LearnMore.LearnMore.Why.Text</p>

              <h4 class="Subtitle Color--green" translate>Toolkit.LearnMore.LearnMore.DoIHaveTo.Question</h4>
              <p translate>Toolkit.LearnMore.LearnMore.DoIHaveTo.Text</p>
            </section>
          </div>
        </div>
      </article>
    </div>
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
