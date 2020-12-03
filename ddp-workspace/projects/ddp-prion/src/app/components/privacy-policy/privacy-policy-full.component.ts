import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy-full',
  template: `
    <prion-header currentRoute="/privacy-policy"></prion-header>
    <div class="Container PrivacyPolicyFull">
      <article class="PageContent">
        <div class="PageLayout row">
          <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
              <h1 class="PageContent-title" translate>Toolkit.PrivacyPolicy.Title</h1>
              <prion-privacy-policy></prion-privacy-policy>
          </div>
        </div>
      </article>
    </div>
  `
})
export class PrivacyPolicyFullComponent {
  constructor() { }
}
