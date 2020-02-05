import { Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from 'toolkit';

@Component({
  selector: 'about-us',
  template: `
  <toolkit-header [showButtons]="true"></toolkit-header>
  <div class="Wrapper">
    <div class="PageHeader">
      <div class="PageHeader-image">
        <span class="PageHeader-imageSpan" role="img" aria-label="About Us Image">
          <span class="PageHeader-imageInner"></span>
        </span>
      </div>
      <div class="PageHeader-box">
        <div class="PageHeader-boxContent">
          <span translate>AboutUs.PageHeader.Part1</span>
          <span class="Italic" translate>Toolkit.Common.Organization</span>,
          <span translate>AboutUs.PageHeader.Part2</span>
        </div>
        <div class="PageHeader-boxFooter">
          <a [href]="countMeInUrl" class="Link" target="_blank">
            <span translate>AboutUs.PageHeaderLink.Part1</span>
            <span class="Italic" translate>Toolkit.Common.Organization </span>
            <span translate>AboutUs.PageHeaderLink.Part2</span>
          </a>
        </div>
      </div>
      <div class="PageHeader-backgroundAboutUs">
        <div class="PageLayout">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h1 class="PageHeader-title PageHeader-titleAboutUs" translate>AboutUs.Title</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <article class="PageContent PageContent-sectionAboutUs">
      <div class="PageLayout">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <section class="PageContent-section">
            <p class="PageContent-text">
              <span class="Italic" translate>Toolkit.Common.Organization</span>
              <span translate>AboutUs.Organization.Section1.Part1</span>
              <span class="Italic" translate>Toolkit.Common.Organization</span>,
              <span translate>AboutUs.Organization.Section1.Part2</span>
              <a href="countMeInUrl" class="Link" target="_blank" translate>AboutUs.Organization.Section1.Part3</a>
            </p>
            <p class="PageContent-text">
              <span translate>AboutUs.Organization.Section2.Part1</span>
              <a href="http://bass.dfci.harvard.edu/" class="Link" target="_blank" translate>AboutUs.Organization.Section2.Part2</a>,
              <span translate>AboutUs.Organization.Section2.Part3</span>
              <span class="Italic" translate>AboutUs.Organization.Section2.Part4</span>
              <span translate>AboutUs.Organization.Section2.Part5</span>
            </p>
          </section>
          <img lazy-resource src="./assets/images/about-page-broad-building.png" class="PageContent-image" alt="Broad Building">
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row--moreTopMargin">
          <section class="Message">
            <h1 class="Message-title" translate>AboutUs.Partners</h1>
          </section>
        </div>
        <div class="row row--moreTopMargin">
          <section class="Message">
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                <a href="http://www.sarctrials.org" target="_blank">
                  <img lazy-resource src="./assets/images/SARC-logo.svg" alt="SARC Logo">
                </a>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                <a href="http://www.sarcomaalliance.org" target="_blank">
                  <img lazy-resource src="./assets/images/SarcomaAlliance-logo.svg" alt="Sarcoma Alliance Logo">
                </a>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                <a href="http://www.curesarcoma.org" target="_blank">
                  <img lazy-resource src="./assets/images/SarcomaFoundationOfAmerica-logo.svg" alt="Sarcoma Foundation of America Logo">
                </a>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                <a href="http://www.targetcancerfoundation.org" target="_blank">
                  <img lazy-resource src="./assets/images/TargetCancerFoundation-logo.svg" alt="Target Cancer Foundation Logo">
                </a>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                <a href="https://www.paulatakacsfoundation.org" target="_blank">
                  <img lazy-resource src="./assets/images/PaulaTakacs-logo.svg" alt="The Paula Takacs Foundation Logo">
                </a>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 Message-partners">
                <a href="http://www.cureasc.org" target="_blank">
                  <img lazy-resource src="./assets/images/AngiosarcomaAwareness-logo.svg" alt="Angiosarcoma Awareness Logo">
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </article>
  </div>
  `
})
export class AboutUsComponent implements OnInit {
  public countMeInUrl: string;

  constructor(@Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.countMeInUrl = this.toolkitConfiguration.countMeInUrl;
  }
}
