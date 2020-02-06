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
      </div>
      <div class="row council-row">
        <div class="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 no-padding">
          <section class="PageContent-section council">
            <h1 class="PageContent-title council">Leadership Team</h1>
            <div class="row">
              <div class="col-lg-2 col-md-3 col-sm-2 col-xs-8 col-xs-offset-2">
                <img class="PageContent-image" alt="Adam Bass photo" src="/assets/images/adam_bass.jpg">
              </div>
              <div class="col-lg-10 col-md-9 col-sm-10 col-xs-12">
                <h2 class="PageContent-subtitle council">Adam Bass, MD</h2>
                <p class="PageContent-text">Adam Bass is an Associate Professor of medicine at Harvard Medical School, a physician/scientist at the Dana-Farber Cancer Institute and Brigham and Women’s Hospital and also is an associate member of the Broad Institute. Dr. Bass obtained his undergraduate degree from Amherst College and his MD degree at Duke University School of Medicine then pursued clinical training in internal medicine at the Massachusetts General Hospital and medical oncology at the Dana-Farber/Partners Cancer Center. At the completion of his clinical training, he was a post-doctoral fellow with Dr. Matthew Meyerson at both the Dana-Farber Cancer Institute and Broad Institute</p>
              </div>
            </div>
            <hr class="HorizontalLine">
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
