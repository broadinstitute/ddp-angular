
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
          <span translate>Toolkit.AboutUs.PageHeader.Pt1</span>
          <span class="Italic" translate>Toolkit.Common.Organization</span>,
          <span translate>Toolkit.AboutUs.PageHeader.Pt2</span>
        </div>
        <div class="PageHeader-boxFooter">
          <a [href]="countMeInUrl" class="Link" target="_blank">
            <span translate>Toolkit.AboutUs.PageHeaderLink.Pt1</span>
            <span class="Italic" translate>Toolkit.Common.Organization</span>
            <span translate>Toolkit.AboutUs.PageHeaderLink.Pt2</span>
          </a>
        </div>
      </div>
      <div class="PageHeader-backgroundAboutUs">
        <div class="PageLayout">
          <div class="row">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h1 class="PageHeader-title PageHeader-titleAboutUs" translate>Toolkit.AboutUs.Title</h1>
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
              <span translate>Toolkit.AboutUs.Content.Paragraph1.Pt1</span>
              <span class="Italic" translate>Toolkit.Common.Organization</span>,
              <span translate>Toolkit.AboutUs.Content.Paragraph1.Pt2</span>
              <a [href]="countMeInUrl" class="Link" target="_blank" translate>Toolkit.AboutUs.ContentLink</a>.
            </p>
            <p class="PageContent-text">
              <span translate>Toolkit.AboutUs.Content.Paragraph2.Pt1</span>
              <span class="Italic" translate>Toolkit.Common.Organization</span>'s
              <span translate>Toolkit.AboutUs.Content.Paragraph2.Pt2</span>
              <a href="http://playgroundinc.com/" class="Link" target="_blank" translate>Toolkit.AboutUs.Content.Paragraph2.Pt3</a>
              <span translate>Toolkit.AboutUs.Content.Paragraph2.Pt4</span>
            </p>
          </section>
          <img lazy-resource src="./assets/images/about-page-broad-building.png" class="PageContent-image" alt="Broad Building">
        </div>
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 row--moreTopMargin">
          <section class="Message">
            <h1 class="Message-title" translate>Toolkit.AboutUs.Partners</h1>
          </section>
        </div>
        <div class="row row--moreTopMargin">
            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <section class="Message">
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.mbcn.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-mbcn.png" [alt]="'Toolkit.Common.LogoAlts.MBCN' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <img lazy-resource class="partner-logo" src="./assets/images/logo-avon.svg" [alt]="'Toolkit.Common.LogoAlts.Avon' | translate">
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.mbcalliance.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-mbca.png" [alt]="'Toolkit.Common.LogoAlts.Alliance' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.lbbc.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-lbbc.svg" [alt]="'Toolkit.Common.LogoAlts.LBBC' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.ibcresearch.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-ibcrf.png" [alt]="'Toolkit.Common.LogoAlts.IBCRF' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.youngsurvival.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-ysc.png" [alt]="'Toolkit.Common.LogoAlts.Young' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.sharecancersupport.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-share.png" [alt]="'Toolkit.Common.LogoAlts.Share' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://malebreastcancercoalition.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-mbcc.png" [alt]="'Toolkit.Common.LogoAlts.Male' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.theresasresearch.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-theresas.png" [alt]="'Toolkit.Common.LogoAlts.Theresa' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://tnbcfoundation.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-tnbc.png" [alt]="'Toolkit.Common.LogoAlts.TNBC' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.theibcnetwork.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-ibc.svg" [alt]="'Toolkit.Common.LogoAlts.IBC' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://advocates4breastcancer.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-a4bc.jpg" [alt]="'Toolkit.Common.LogoAlts.A4BC' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.metavivor.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-metavivor.png" [alt]="'Toolkit.Common.LogoAlts.Metavivor' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://metup.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-metup.png" [alt]="'Toolkit.Common.LogoAlts.Metup' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.tigerlilyfoundation.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-tigerlily.jpg" [alt]="'Toolkit.Common.LogoAlts.Tigerlily' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://ww5.komen.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-susangkomen.png" [alt]="'Toolkit.Common.LogoAlts.Komen' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.bcrf.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bcrf.svg" [alt]="'Toolkit.Common.LogoAlts.BCRF' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.drsusanloveresearch.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-dslrf.png" [alt]="'Toolkit.Common.LogoAlts.DSLFR' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://bcsm.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bcsm.png" [alt]="'Toolkit.Common.LogoAlts.BCSM' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://hopescarves.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-hopescarves.svg" [alt]="'Toolkit.Common.LogoAlts.HopeScarves' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.thecancercouch.com/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-cancer-couch-foundation.png" [alt]="'Toolkit.Common.LogoAlts.CancerCouch' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://twistedpink.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-twistedpink.jpg" [alt]="'Toolkit.Common.LogoAlts.TwistedPink' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://www.cierrasisters.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-cierra-sisters.png" [alt]="'Toolkit.Common.LogoAlts.CierraSisters' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.breastcancertrials.org/BCTIncludes/index.html" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bc-trials.jpg" [alt]="'Toolkit.Common.LogoAlts.BC' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="http://breastcanceralliance.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-bca.jpg" [alt]="'Toolkit.Common.LogoAlts.BCAlliance' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://thetutuproject.com/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-tutuproject.jpg" [alt]="'Toolkit.Common.LogoAlts.TutuProject' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.mpbcalliance.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-MetaplasticBreastGlobalAlliance.png" [alt]="'Toolkit.Common.LogoAlts.MPBCAlliance' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://lobularbreastcancer.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-lbca.png" [alt]="'Toolkit.Common.LogoAlts.LBCA' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.facingourrisk.org/index.php" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-force.png" [alt]="'Toolkit.Common.LogoAlts.Force' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://shaysharpespinkwishes.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-shaysharpes.png" [alt]="'Toolkit.Common.LogoAlts.Shay' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://www.metastasis-research.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-MRS_LogoColor.jpg" [alt]="'Toolkit.Common.LogoAlts.MRS' | translate"></a>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
                        <a href="https://sistersrus.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo-highresolutionpng.png" [alt]="'Toolkit.Common.LogoAlts.Sisters' | translate"></a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
                        <img lazy-resource class="partner-logo" src="./assets/images/logo-hmn.png" [alt]="'Toolkit.Common.LogoAlts.HMN' | translate">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
                        <img lazy-resource class="partner-logo" src="./assets/images/logo-min_coalition.png" [alt]="'Toolkit.Common.LogoAlts.Min' | translate">
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
                        <a href="https://mbccanada.org/" target="_blank"><img lazy-resource class="partner-logo" src="./assets/images/logo_mbccanada.png" [alt]="'Toolkit.Common.LogoAlts.MBCCanada' | translate"></a>
                    </div>
                </div>
            </section>
          </div>
      </div>
      <div class="row row--moreMargin">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <section class="Message">
            <div class="Message-quote">
              <blockquote translate>
                Toolkit.AboutUs.Quote
              </blockquote>
            </div>
            <br/>
            <div class="Message-quote Message-quoteExtraMargin" [innerHTML]="'Toolkit.AboutUs.QuoteAuthor' | translate">
            </div>
          </section>
          </div>
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
