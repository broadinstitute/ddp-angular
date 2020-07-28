import { Component } from '@angular/core';

@Component({
  selector: 'ddp-privacy-policy-static',
  template: `
    <div class="Container">
      <article class="PageContent">
        <div class="PageLayout row">
          <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
            <section class="PageContent-section NoPadding">
              <h1 class="PageContent-title" translate>SDK.PrivacyPolicy.Title</h1>
              <h4 class="Subtitle Color--green" translate>SDK.PrivacyPolicy.P1</h4>
              <p translate>SDK.PrivacyPolicy.P1</p>
              <h4 class="Subtitle Color--green" translate>SDK.PrivacyPolicy.P2</h4>
              <p translate>SDK.PrivacyPolicy.P2</p>
              <h4 class="Subtitle Color--green" translate>SDK.PrivacyPolicy.P3</h4>
              <p translate>SDK.PrivacyPolicy.P3</p>
            </section>
          </div>
        </div>
      </article>
    </div>
  `,
})
export class PrivacyPolicyStaticComponent {
}
