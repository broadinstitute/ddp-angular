import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  LogLevel,
  ConfigurationService,
  AnalyticsEventsService,
  AnalyticsEvent
} from 'ddp-sdk';

import {
  ToolkitModule,
  ToolkitConfigurationService,
  AppComponent
} from 'toolkit';

import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PartnersComponent } from './components/partners/partners.component';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: Function;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = 'cmi-mbc';
tkCfg.aboutYouGuid = 'ABOUTYOU';
tkCfg.consentGuid = 'CONSENT';
tkCfg.releaseGuid = 'RELEASE';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.tissueConsentGuid = 'TISSUECONSENT';
tkCfg.tissueReleaseGuid = 'TISSUERELEASE';
tkCfg.bloodConsentGuid = 'BLOODCONSENT';
tkCfg.bloodReleaseGuid = 'BLOODRELEASE';
tkCfg.followupGuid = 'FOLLOWUP';
tkCfg.aboutYouUrl = 'about-you';
tkCfg.consentUrl = 'consent';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.stayInformedUrl = 'stay-informed';
tkCfg.moreDetailsUrl = 'more-details';
tkCfg.tissueConsentUrl = 'tissue-consent';
tkCfg.tissueReleaseUrl = 'tissue-release';
tkCfg.bloodConsentUrl = 'blood-consent';
tkCfg.bloodReleaseUrl = 'blood-release-survey';
tkCfg.followupUrl = 'followup';
tkCfg.internationalPatientsUrl = 'international-patients';
tkCfg.phone = '617-800-1622';
tkCfg.infoEmail = 'info@mbcproject.org';
tkCfg.dataEmail = 'data@mbcproject.org';
tkCfg.twitterAccountId = 'mbc_project';
tkCfg.facebookGroupId = 'The-Metastatic-Breast-Cancer-Project-852059048224675';
tkCfg.instagramId = 'mbc_project';
tkCfg.cBioPortalLink = 'http://www.cbioportal.org/study?id=brca_mbcproject_wagle_2017#summary';
tkCfg.countMeInUrl = 'https://joincountmein.org/';
tkCfg.showDataRelease = true;
tkCfg.showInfoForPhysicians = false;
tkCfg.showBlog = true;
tkCfg.blogUrl = 'http://mbc-project.blogspot.com/';

export const config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = tkCfg.studyGuid;
config.logLevel = LogLevel.Info;
config.baseUrl = location.origin + base;
config.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
config.loginLandingUrl = DDP_ENV.loginLandingUrl;
config.auth0CodeRedirect = location.origin + base + 'auth';
config.localRegistrationUrl = config.backendUrl + '/pepper/v1/register';
config.doLocalRegistration = DDP_ENV.doLocalRegistration;
config.mapsApiKey = DDP_ENV.mapsApiKey;
config.auth0Audience = DDP_ENV.auth0Audience;
config.projectGAToken = DDP_ENV.projectGAToken;

export function translateFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const locale = 'en';
      translate.setDefaultLang(locale);
      translate.use(locale).subscribe(() => {
        console.log(`Successfully initialized '${locale}' language as default.`);
      }, err => {
        console.error(`Problem with '${locale}' language initialization.`);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule
  ],
  declarations: [
    AboutUsComponent,
    DataReleaseComponent,
    MoreDetailsComponent,
    WelcomeComponent,
    PartnersComponent
  ],
  providers: [
    {
      provide: 'ddp.config',
      useValue: config
    },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: tkCfg
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [
        TranslateService,
        Injector
      ],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private analytics: AnalyticsEventsService) {
    this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
      ga('send', event);
      ga('platform.send', event);
    });
  }
}
