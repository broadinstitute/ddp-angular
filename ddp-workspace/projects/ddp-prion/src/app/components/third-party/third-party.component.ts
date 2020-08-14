import { Component } from '@angular/core';

@Component({
  selector: 'app-third-party',
  template: `
    <prion-header currentRoute="/3rd-party"></prion-header>
    <div class="Container">
      <h2 class="PageContent-title" translate>App.ThirdParty.Title</h2>
      <p translate>App.ThirdParty.Description</p>
      <ul class="list">
        <li>
          <a href="https://sendgrid.com/" translate>App.ThirdParty.Tools.Sendgrid</a>
          <span translate>App.ThirdParty.Usage.email</span>
        </li>
        <li>
          <a href="https://auth0.com/" translate>App.ThirdParty.Tools.Auth0</a>
          <span translate>App.ThirdParty.Usage.authentication</span>
        </li>
        <li>
          <a href="https://earlyaccess.rapid7.com/tcell/" translate>App.ThirdParty.Tools.Tcell</a>
          <span translate>App.ThirdParty.Usage.security</span>
        </li>
        <li>
          <a href="https://cloud.google.com/" translate>App.ThirdParty.Tools.Google_Cloud</a>
          <span translate>App.ThirdParty.Usage.host</span>
        </li>
        <li>
          <a href="https://analytics.google.com/" translate>App.ThirdParty.Tools.Google_Analytics</a>
          <span translate>App.ThirdParty.Usage.analytics</span>
        </li>
      </ul>
      <p class="third-party--date">
        <span translate>App.ThirdParty.Last_updated</span>
        <span>08/14/2020</span>
      </p>
    </div>
    `
})
export class ThirdPartyComponent  {
  constructor() { }
}
