import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from "toolkit";

@Component({
  selector: 'privacy-policy-full',
  template: `
    <prion-header currentRoute="/privacy-policy"></prion-header>
    <div class="Container PrivacyPolicyFull">
      <article class="PageContent">
        <div class="PageLayout row">
          <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
              <h1 class="PageContent-title" translate>SDK.PrivacyPolicy.Title</h1>
              <prion-privacy-policy></prion-privacy-policy>
          </div>
        </div>
      </article>
    </div>
  `
})
export class PrivacyPolicyFullComponent implements OnInit {
  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {

  }
}
