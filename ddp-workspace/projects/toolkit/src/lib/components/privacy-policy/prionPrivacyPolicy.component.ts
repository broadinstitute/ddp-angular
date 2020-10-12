import {
  Component
} from '@angular/core';

@Component({
  selector: 'prion-privacy-policy',
  template: `
    <section class="PageContent-section">
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Intro.Title</h4>
      <p><span translate>Toolkit.PrivacyPolicy.Intro.Text.P1</span><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.Intro.Text.P2BoldUnderline</span><span
        translate>Toolkit.PrivacyPolicy.Intro.Text.P3</span><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.Intro.Text.P4BoldUnderline</span><span
        translate>Toolkit.PrivacyPolicy.Intro.Text.P5</span><span class="Accent" translate>Toolkit.PrivacyPolicy.Intro.Text.P6Bold</span>
      </p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Who.Title</h4>
      <p><span translate>Toolkit.PrivacyPolicy.Who.Text.P1</span></p>
      <ol class="list">
        <li translate>Toolkit.PrivacyPolicy.Who.Text.P2Number.1</li>
        <li translate>Toolkit.PrivacyPolicy.Who.Text.P2Number.2</li>
        <li translate>Toolkit.PrivacyPolicy.Who.Text.P2Number.3</li>
      </ol>
      <p><span translate>Toolkit.PrivacyPolicy.Who.Text.P3</span><a href="/" class="Link Link--green"
                                                                translate>Toolkit.PrivacyPolicy.Who.Text.P4Link</a><span
        translate>Toolkit.PrivacyPolicy.Who.Text.P5</span><a href="https://www.broadinstitute.org/about-us"
                                                         target="_blank" rel="noopener" class="Link Link--green"
                                                         translate>Toolkit.PrivacyPolicy.Who.Text.P6Link</a><span
        translate>Toolkit.PrivacyPolicy.Who.Text.P7</span></p>
      <p><span translate>Toolkit.PrivacyPolicy.Who.Text.P8</span><a href="/3rd-party" class="Accent Link Link--green"
                                                                translate>Toolkit.PrivacyPolicy.Who.Text.P9Bold</a><span
        translate>Toolkit.PrivacyPolicy.Who.Text.P10</span></p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Purpose.Title</h4>
      <p><span translate>Toolkit.PrivacyPolicy.Purpose.Text.P1</span><span class="Accent" translate>Toolkit.PrivacyPolicy.Purpose.Text.P2Bold</span><span
        translate>Toolkit.PrivacyPolicy.Purpose.Text.P3</span><span class="Accent" translate>Toolkit.PrivacyPolicy.Purpose.Text.P4Bold</span><span
        translate>Toolkit.PrivacyPolicy.Purpose.Text.P5</span><span class="Accent" translate>Toolkit.PrivacyPolicy.Purpose.Text.P6Bold</span><span
        translate>Toolkit.PrivacyPolicy.Purpose.Text.P7</span><span class="Accent" translate>Toolkit.PrivacyPolicy.Purpose.Text.P8Bold</span><span
        translate>Toolkit.PrivacyPolicy.Purpose.Text.P9</span></p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Use.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Use.Text</p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.HowCollect.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.HowCollect.Text.P1</p>
      <p><span translate>Toolkit.PrivacyPolicy.HowCollect.Text.P2</span><span class="Underline" translate>Toolkit.PrivacyPolicy.HowCollect.Text.P3Underline</span><span
        translate>Toolkit.PrivacyPolicy.HowCollect.Text.P4</span></p>
      <ul class="list">
        <li><span class="Underline" translate>Toolkit.PrivacyPolicy.HowCollect.Text.P5Underline</span><span
          translate>Toolkit.PrivacyPolicy.HowCollect.Text.P6</span></li>
        <li><span class="Underline" translate>Toolkit.PrivacyPolicy.HowCollect.Text.P7Underline</span><span
          translate>Toolkit.PrivacyPolicy.HowCollect.Text.P8</span></li>
        <li><span class="Underline" translate>Toolkit.PrivacyPolicy.HowCollect.Text.P9Underline</span><span
          translate>Toolkit.PrivacyPolicy.HowCollect.Text.P10</span></li>
        <li><span class="Underline" translate>Toolkit.PrivacyPolicy.HowCollect.Text.P11Underline</span><span
          translate>Toolkit.PrivacyPolicy.HowCollect.Text.P12</span></li>
      </ul>
      <p translate>Toolkit.PrivacyPolicy.HowCollect.Text.P13</p>
      <ul class="list">
        <li translate>Toolkit.PrivacyPolicy.HowCollect.Text.P14</li>
        <li translate>Toolkit.PrivacyPolicy.HowCollect.Text.P15</li>
      </ul>


      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.WhatCollect.Title</h4>
      <ul class="list list--spaced">
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P1BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P2</span>
        </li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P3BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P4</span>
        </li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P5BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P6</span>
        </li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P7BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.WhatCollect.Text.P8</span>
        </li>
      </ul>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Cookies.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Cookies.Text.P1</p>
      <ul class="list list--spaced">
        <li><span class="Underline" translate>Toolkit.PrivacyPolicy.Cookies.Text.P2Underline</span><span translate>Toolkit.PrivacyPolicy.Cookies.Text.P3</span>
        </li>
        <li><span class="Underline" translate>Toolkit.PrivacyPolicy.Cookies.Text.P4Underline</span><span translate>Toolkit.PrivacyPolicy.Cookies.Text.P5</span>
        </li>
      </ul>
      <p><span class="Accent" translate>Toolkit.PrivacyPolicy.Cookies.Text.P6Bold</span><span translate>Toolkit.PrivacyPolicy.Cookies.Text.P7</span>
      </p>
      <p translate>Toolkit.PrivacyPolicy.Cookies.Text.P8</p>
      <div class="CenterDiv SpacedButtonDiv">
        <toolkit-cookies-preferences-button [privacyPolicyLink]="false"
                                        [className]="'Button Button--primary'"></toolkit-cookies-preferences-button>
      </div>
      <p><span class="Accent" translate>Toolkit.PrivacyPolicy.Cookies.Text.P9Bold</span><span translate>Toolkit.PrivacyPolicy.Cookies.Text.P10</span>
      </p>
      <p><span class="Accent" translate>Toolkit.PrivacyPolicy.Cookies.Text.P11Bold</span><span translate>Toolkit.PrivacyPolicy.Cookies.Text.P12</span><span
        class="Accent Underline" translate>Toolkit.PrivacyPolicy.Cookies.Text.P13BoldUnderline</span><span
        translate>Toolkit.PrivacyPolicy.Cookies.Text.P14</span><a href="https://allaboutdnt.com" target="_blank"
                                                              rel="noopener" class="Link Link--green" translate>Toolkit.PrivacyPolicy.Cookies.Text.P15Link</a><span
        translate>Toolkit.PrivacyPolicy.Cookies.Text.P16</span></p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.HowUse.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.HowUse.Text.P1</p>
      <ul class="list list--spaced">
        <li><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.HowUse.Text.P2BoldUnderline</span><span
          translate>Toolkit.PrivacyPolicy.HowUse.Text.P3</span></li>
        <li><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.HowUse.Text.P4BoldUnderline</span><span
          translate>Toolkit.PrivacyPolicy.HowUse.Text.P5</span></li>
        <li><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.HowUse.Text.P6BoldUnderline</span><span
          translate>Toolkit.PrivacyPolicy.HowUse.Text.P7</span></li>
        <li><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.HowUse.Text.P8BoldUnderline</span><span
          translate>Toolkit.PrivacyPolicy.HowUse.Text.P9</span></li>
        <li><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.HowUse.Text.P10BoldUnderline</span><span
          translate>Toolkit.PrivacyPolicy.HowUse.Text.P11</span></li>
      </ul>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.ShareWith.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.ShareWith.Text.P1</p>
      <ul class="list list--spaced">
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.ShareWith.Text.P2BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.ShareWith.Text.P3</span><span
          class="Accent" translate>Toolkit.PrivacyPolicy.ShareWith.Text.P4Bold</span></li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.ShareWith.Text.P5BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.ShareWith.Text.P6</span>
        </li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.ShareWith.Text.P7BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.ShareWith.Text.P8</span>
          <ul class="list list--sublist">
            <li translate>Toolkit.PrivacyPolicy.ShareWith.Text.P9</li>
            <li translate>Toolkit.PrivacyPolicy.ShareWith.Text.P10</li>
          </ul>
          <p translate>Toolkit.PrivacyPolicy.ShareWith.Text.P11</p></li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.ShareWith.Text.P12BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.ShareWith.Text.P13</span>
        </li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.ShareWith.Text.P14BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.ShareWith.Text.P15</span>
        </li>
        <li><span class="Accent Underline"
                  translate>Toolkit.PrivacyPolicy.ShareWith.Text.P16BoldUnderline</span><span translate>Toolkit.PrivacyPolicy.ShareWith.Text.P17</span>
        </li>
      </ul>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.ThirdParty.Title</h4>
      <p><span translate>Toolkit.PrivacyPolicy.ThirdParty.Text.P1</span><a href="/3rd-party"
                                                                       class="Accent Underline Link Link--green"
                                                                       translate>Toolkit.PrivacyPolicy.ThirdParty.Text.P2BoldUnderline</a><span
        translate>Toolkit.PrivacyPolicy.ThirdParty.Text.P3</span></p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.OtherUsers.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.OtherUsers.Text</p>

      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.InformationRights.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.InformationRights.Text.P1</p>
      <div class="CenterDiv SpacedButtonDiv">
        <toolkit-modal-activity-button
          activityGuid="PRIONREQUEST"
          submitButtonText="Toolkit.DataRequest.SubmitRequest"
          showFinalConfirmation="true"
          confirmationButtonText="Toolkit.DataRequest.Okay"
          disabledTooltip="Toolkit.DataRequest.SignInTooltip"
          buttonText="Toolkit.DataRequest.DataRequest"></toolkit-modal-activity-button>
      </div>
      <p translate>Toolkit.PrivacyPolicy.InformationRights.Text.P2</p>
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Security.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Security.Text.P1</p>
      <ul class="list">
        <li translate>Toolkit.PrivacyPolicy.Security.Text.P2</li>
        <li translate>Toolkit.PrivacyPolicy.Security.Text.P3</li>
        <li translate>Toolkit.PrivacyPolicy.Security.Text.P4</li>
        <li translate>Toolkit.PrivacyPolicy.Security.Text.P5</li>
        <li translate>Toolkit.PrivacyPolicy.Security.Text.P6</li>
        <li translate>Toolkit.PrivacyPolicy.Security.Text.P7</li>
      </ul>
      <p translate>Toolkit.PrivacyPolicy.Security.Text.P8</p>
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Children.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Children.Text</p>
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Country.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Country.Text</p>
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Contact.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Contact.Text.P1</p>
      <p class="Accent NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P2Bold</p>
      <p class="NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P3</p>
      <p class="NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P4</p>
      <p class="NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P5</p>
      <p class="NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P6</p>
      <p class="NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P7</p>
      <p class="NoMarginBottom" translate>Toolkit.PrivacyPolicy.Contact.Text.P8</p>
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.Update.Title</h4>
      <p translate>Toolkit.PrivacyPolicy.Update.Text.P1</p>
      <p translate>Toolkit.PrivacyPolicy.Update.Text.P2</p>
      <h4 class="Subtitle Color--green" translate>Toolkit.PrivacyPolicy.EU.Title</h4>
      <p><span translate>Toolkit.PrivacyPolicy.EU.Text.P1</span><span class="Accent Underline" translate>Toolkit.PrivacyPolicy.EU.Text.P2BoldUnderline</span><span
        translate>Toolkit.PrivacyPolicy.EU.Text.P3</span></p>
      <ul class="list list--spaced">
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P4Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P5</span>
          <ul class="list list--sublist">
            <li translate>Toolkit.PrivacyPolicy.EU.Text.P6</li>
            <li translate>Toolkit.PrivacyPolicy.EU.Text.P7</li>
            <li translate>Toolkit.PrivacyPolicy.EU.Text.P8</li>
            <li translate>Toolkit.PrivacyPolicy.EU.Text.P9</li>
            <li translate>Toolkit.PrivacyPolicy.EU.Text.P10</li>
          </ul>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P11Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P12</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P13Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P14</span>
        </li>
      </ul>
      <p><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P15Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P16</span>
      </p>
      <p><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P17Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P18</span>
      </p>
      <ul class="list">
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P19Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P20</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P21Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P22</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P23Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P24</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P25Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P26</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P27Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P28</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P29Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P30</span>
        </li>
        <li><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P31Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P32</span>
        </li>
      </ul>
      <p translate>Toolkit.PrivacyPolicy.EU.Text.P33</p>
      <p><span class="Accent" translate>Toolkit.PrivacyPolicy.EU.Text.P34Bold</span><span translate>Toolkit.PrivacyPolicy.EU.Text.P35</span>
      </p>
    </section>
  `,
})
export class PrionPrivacyPolicyComponent {
  constructor() { }
}
