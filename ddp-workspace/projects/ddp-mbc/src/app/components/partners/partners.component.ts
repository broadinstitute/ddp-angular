import { Component } from '@angular/core';

@Component({
  selector: 'app-partners',
  template: `
  <div class="row">
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
        <a href="http://www.mbcn.org/" target="_blank"><img lazy-resource class="partner-logo"
                src="./assets/images/logo-mbcn.png" [alt]="'Partners.MBCN' | translate"></a>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
        <img lazy-resource class="partner-logo" src="./assets/images/logo-avon.svg"
            [alt]="'Partners.Avon' | translate">
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
        <a href="https://www.mbcalliance.org/" target="_blank"><img lazy-resource class="partner-logo"
                src="./assets/images/logo-mbca.png" [alt]="'Partners.Alliance' | translate"></a>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
        <a href="http://www.lbbc.org/" target="_blank"><img lazy-resource class="partner-logo"
                src="./assets/images/logo-lbbc.png" [alt]="'Partners.LBBC' | translate"></a>
    </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://www.ibcresearch.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-ibcrf.png" [alt]="'Partners.IBCRF' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.youngsurvival.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-ysc.png" [alt]="'Partners.Young' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.sharecancersupport.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-share.png" [alt]="'Partners.Share' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://malebreastcancercoalition.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-mbcc.png" [alt]="'Partners.Male' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://www.theresasresearch.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-theresas.png" [alt]="'Partners.Theresa' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://tnbcfoundation.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-tnbc.png" [alt]="'Partners.TNBC' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.theibcnetwork.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-ibc.svg" [alt]="'Partners.IBC' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://advocates4breastcancer.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-a4bc.jpg" [alt]="'Partners.A4BC' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://www.metavivor.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-metavivor.png" [alt]="'Partners.Metavivor' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://metup.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-metup.png" [alt]="'Partners.Metup' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.tigerlilyfoundation.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-tigerlily.jpg" [alt]="'Partners.Tigerlily' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://ww5.komen.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-susangkomen.png" [alt]="'Partners.Komen' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.bcrf.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-bcrf.svg" [alt]="'Partners.BCRF' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.drsusanloveresearch.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-dslrf.png" [alt]="'Partners.DSLFR' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://bcsm.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-bcsm.png" [alt]="'Partners.BCSM' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://hopescarves.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-hopescarves.svg"
                  [alt]="'Partners.HopeScarves' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.thecancercouch.com/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-cancer-couch-foundation.png"
                  [alt]="'Partners.CancerCouch' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://twistedpink.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-twistedpink.jpg"
                  [alt]="'Partners.TwistedPink' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://www.cierrasisters.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-cierra-sisters.png"
                  [alt]="'Partners.CierraSisters' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.breastcancertrials.org/BCTIncludes/index.html" target="_blank"><img lazy-resource
                  class="partner-logo" src="./assets/images/logo-bc-trials.jpg"
                  [alt]="'Partners.BC' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="http://breastcanceralliance.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-bca.jpg" [alt]="'Partners.BCAlliance' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://thetutuproject.com/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-tutuproject.jpg"
                  [alt]="'Partners.TutuProject' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.mpbcalliance.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-MetaplasticBreastGlobalAlliance.png"
                  [alt]="'Partners.MPBCAlliance' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://lobularbreastcancer.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-lbca.png" [alt]="'Partners.LBCA' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.facingourrisk.org/index.php" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-force.png" [alt]="'Partners.Force' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://shaysharpespinkwishes.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-shaysharpes.png" [alt]="'Partners.Shay' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://www.metastasis-research.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-MRS_LogoColor.jpg" [alt]="'Partners.MRS' | translate"></a>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 Message-partners">
          <a href="https://sistersrus.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo-highresolutionpng.png"
                  [alt]="'Partners.Sisters' | translate"></a>
      </div>
  </div>
  <div class="row">
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
          <img lazy-resource class="partner-logo" src="./assets/images/logo-hmn.png"
              [alt]="'Partners.HMN' | translate">
      </div>
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
          <img lazy-resource class="partner-logo" src="./assets/images/logo-min_coalition.png"
              [alt]="'Partners.Min' | translate">
      </div>
      <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 Message-partners">
          <a href="https://mbccanada.org/" target="_blank"><img lazy-resource class="partner-logo"
                  src="./assets/images/logo_mbccanada.png" [alt]="'Partners.MBCCanada' | translate"></a>
      </div>
  </div>
  `
})
export class PartnersComponent { }
