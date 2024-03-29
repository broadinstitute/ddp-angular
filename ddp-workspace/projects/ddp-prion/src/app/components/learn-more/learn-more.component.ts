import { Component } from '@angular/core';

@Component({
    selector: 'app-learn-more',
    template: `
    <prion-header currentRoute="/learn-more"></prion-header>
    <div class="Container">
      <article class="PageContent">
        <div class="PageLayout row">
          <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
            <section class="PageContent-section NoPadding">
              <h1 class="PageContent-title" translate>App.LearnMore.LearnMore.Title</h1>

              <h4 class="Subtitle Color--green" translate>App.LearnMore.LearnMore.WhatIs.Question</h4>
              <p translate>App.LearnMore.LearnMore.WhatIs.Text</p>

              <h4 class="Subtitle Color--green" translate>App.LearnMore.LearnMore.For.Question</h4>
              <p translate>App.LearnMore.LearnMore.For.Text</p>

              <h4 class="Subtitle Color--green" translate>App.LearnMore.LearnMore.Participate.Question</h4>
              <p translate>App.LearnMore.LearnMore.Participate.Text</p>

              <h4 class="Subtitle Color--green" translate>App.LearnMore.LearnMore.Why.Question</h4>
              <p translate>App.LearnMore.LearnMore.Why.Text</p>

              <h4 class="Subtitle Color--green" translate>App.LearnMore.LearnMore.DoIHaveTo.Question</h4>
              <p translate>App.LearnMore.LearnMore.DoIHaveTo.Text</p>
            </section>
          </div>
        </div>
      </article>
    </div>
    `
})
export class LearnMoreComponent { }
