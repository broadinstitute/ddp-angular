import { Component } from '@angular/core';

@Component({
  selector: 'prion-privacy-policy',
  template: `
    <div class="Container">
      <article class="PageContent">
        <div class="PageLayout row">
          <div class="col-lg-8 col-md-10 col-sm-12 col-xs-12">
            <section class="PageContent-section NoPadding">
              <h1 class="PageContent-title" translate>App.PrivacyPolicy.Title</h1>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Intro.Title</h4>
              <p><span translate>App.PrivacyPolicy.Intro.Text.P1</span><span class="Accent Underline" translate>App.PrivacyPolicy.Intro.Text.P2BoldUnderline</span><span translate>App.PrivacyPolicy.Intro.Text.P3</span><span class="Accent Underline" translate>App.PrivacyPolicy.Intro.Text.P4BoldUnderline</span><span translate>App.PrivacyPolicy.Intro.Text.P5</span><span class="Accent" translate>App.PrivacyPolicy.Intro.Text.P6Bold</span></p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Who.Title</h4>
              <p><span translate>App.PrivacyPolicy.Who.Text.P1</span></p>
              <ol class="list"><li translate>App.PrivacyPolicy.Who.Text.P2Number.1</li><li translate>App.PrivacyPolicy.Who.Text.P2Number.2</li><li translate>App.PrivacyPolicy.Who.Text.P2Number.3</li></ol>
              <p><span translate>App.PrivacyPolicy.Who.Text.P3</span><span class="Accent" translate>App.PrivacyPolicy.Who.Text.P4Bold</span><span translate>App.PrivacyPolicy.Who.Text.P5</span></p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Purpose.Title</h4>
              <p><span translate>App.PrivacyPolicy.Purpose.Text.P1</span><span class="Accent" translate>App.PrivacyPolicy.Purpose.Text.P2Bold</span><span translate>App.PrivacyPolicy.Purpose.Text.P3</span><span class="Accent" translate>App.PrivacyPolicy.Purpose.Text.P4Bold</span><span translate>App.PrivacyPolicy.Purpose.Text.P5</span><span class="Accent" translate>App.PrivacyPolicy.Purpose.Text.P6Bold</span><span translate>App.PrivacyPolicy.Purpose.Text.P7</span><span class="Accent" translate>App.PrivacyPolicy.Purpose.Text.P8Bold</span><span translate>App.PrivacyPolicy.Purpose.Text.P9</span></p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Use.Title</h4>
              <p translate>App.PrivacyPolicy.Use.Text</p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.HowCollect.Title</h4>
              <p translate>App.PrivacyPolicy.HowCollect.Text.P1</p>
              <p><span translate>App.PrivacyPolicy.HowCollect.Text.P2</span><span class="Underline" translate>App.PrivacyPolicy.HowCollect.Text.P3Underline</span><span translate>App.PrivacyPolicy.HowCollect.Text.P4</span></p>
              <ul class="list"><li><span class="Underline" translate>App.PrivacyPolicy.HowCollect.Text.P5Underline</span><span translate>App.PrivacyPolicy.HowCollect.Text.P6</span></li>
                <li><span class="Underline" translate>App.PrivacyPolicy.HowCollect.Text.P7Underline</span><span translate>App.PrivacyPolicy.HowCollect.Text.P8</span></li>
                <li><span class="Underline" translate>App.PrivacyPolicy.HowCollect.Text.P9Underline</span><span translate>App.PrivacyPolicy.HowCollect.Text.P10</span></li>
                <li><span class="Underline" translate>App.PrivacyPolicy.HowCollect.Text.P11Underline</span><span translate>App.PrivacyPolicy.HowCollect.Text.P12</span></li></ul>
                <p translate>App.PrivacyPolicy.HowCollect.Text.P13</p>
              <ul class="list"><li translate>App.PrivacyPolicy.HowCollect.Text.P14</li><li translate>App.PrivacyPolicy.HowCollect.Text.P15</li></ul>
              
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.WhatCollect.Title</h4>
              <ul class="list">
                <li><span class="Accent Underline" translate>App.PrivacyPolicy.WhatCollect.Text.P1BoldUnderline</span><span translate>App.PrivacyPolicy.WhatCollect.Text.P2</span></li>
                <li><span class="Accent Underline" translate>App.PrivacyPolicy.WhatCollect.Text.P3BoldUnderline</span><span translate>App.PrivacyPolicy.WhatCollect.Text.P4</span></li>
                <li><span class="Accent Underline" translate>App.PrivacyPolicy.WhatCollect.Text.P5BoldUnderline</span><span translate>App.PrivacyPolicy.WhatCollect.Text.P6</span></li>
                <li><span class="Accent Underline" translate>App.PrivacyPolicy.WhatCollect.Text.P7BoldUnderline</span><span translate>App.PrivacyPolicy.WhatCollect.Text.P8</span></li>
              </ul>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Cookies.Title</h4>
              <p translate>App.PrivacyPolicy.Cookies.Text.P1</p>
              <ul class="list">
                <li><span class="Underline" translate>App.PrivacyPolicy.Cookies.Text.P2Underline</span><span translate>App.PrivacyPolicy.Cookies.Text.P3</span></li>
                <li><span class="Underline" translate>App.PrivacyPolicy.Cookies.Text.P4Underline</span><span translate>App.PrivacyPolicy.Cookies.Text.P5</span></li>
              </ul>
              <p><span class="Accent" translate>App.PrivacyPolicy.Cookies.Text.P6Bold</span><span translate>App.PrivacyPolicy.Cookies.Text.P7</span></p>
              <p translate>App.PrivacyPolicy.Cookies.Text.P8</p>
              <button translate>App.PrivacyPolicy.CookiePreferences</button>
              <p></p>
              <p></p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.HowUse.Title</h4>
              <p translate>App.PrivacyPolicy.HowUse.Text</p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.ShareWith.Title</h4>
              <p translate>App.PrivacyPolicy.ShareWith.Text</p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.ThirdParty.Title</h4>
              <p translate>App.PrivacyPolicy.ThirdParty.Text</p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.OtherUsers.Title</h4>
              <p translate>App.PrivacyPolicy.OtherUsers.Text</p>
              
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.InformationRights.Title</h4>
              <p translate>App.PrivacyPolicy.InformationRights.Text.P1</p>
              
              <button translate>App.PrivacyPolicy.DataRequest</button>
              <p translate>App.PrivacyPolicy.InformationRights.Text.P2</p>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Security.Title</h4>
              <p translate>App.PrivacyPolicy.Security.Text</p>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Children.Title</h4>
              <p translate>App.PrivacyPolicy.Children.Text</p>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Country.Title</h4>
              <p translate>App.PrivacyPolicy.Country.Text</p>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Contact.Title</h4>
              <p translate>App.PrivacyPolicy.Contact.Text</p>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.Update.Title</h4>
              <p translate>App.PrivacyPolicy.Update.Text</p>
              <h4 class="Subtitle Color--green" translate>App.PrivacyPolicy.EU.Title</h4>
              <p translate>App.PrivacyPolicy.EU.Text</p>
            </section>
          </div>
        </div>
      </article>
    </div>
  `
})
export class PrionPrivacyPolicyComponent {
  constructor() { }
}
