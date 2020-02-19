import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  LogLevel,
  ConfigurationService,
  GoogleAnalyticsEventsService
} from 'ddp-sdk';

import {
  ToolkitModule,
  ToolkitConfigurationService,
  AppComponent
} from 'toolkit';

import { WelcomeComponent } from './components/welcome/welcome.component';
// import { MoreDetailsComponent } from './components/more-details/more-details.component';
// import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.aboutYouGuid = ''; // to be defined later
toolkitConfig.consentGuid = ''; // to be defined later
toolkitConfig.releaseGuid = ''; // to be defined later
toolkitConfig.followupGuid = ''; // to be defined later
toolkitConfig.dashboardGuid = 'DASHBOARD';
toolkitConfig.aboutYouUrl = 'about-you';
toolkitConfig.consentUrl = 'consent';
toolkitConfig.releaseUrl = 'release-survey';
toolkitConfig.followupUrl = 'followup-consent';
toolkitConfig.dashboardUrl = 'dashboard';
toolkitConfig.activityUrl = 'activity';
toolkitConfig.errorUrl = 'error';
toolkitConfig.stayInformedUrl = 'stay-informed';
toolkitConfig.internationalPatientsUrl = 'international-patients';
toolkitConfig.phone = '651-293-5029';
toolkitConfig.infoEmail = 'info@mpcproject.org';
toolkitConfig.dataEmail = 'data@mpcproject.org'
toolkitConfig.twitterAccountId = 'PrCaProject';
toolkitConfig.facebookGroupId = 'Prostate-Cancer-Project-1828647940721720';
toolkitConfig.countMeInUrl = 'https://joincountmein.org/';
toolkitConfig.showDataRelease = true;
toolkitConfig.showInfoForPhysicians = true;
toolkitConfig.showBlog = false;

const sdkConfig = new ConfigurationService();
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.logLevel = LogLevel.Info;
sdkConfig.baseUrl = location.origin + base;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;

function translateFactory(translate: TranslateService, injector: Injector) {
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
    WelcomeComponent,
    // MoreDetailsComponent,
    // AboutUsComponent,
    DataReleaseComponent
  ],
  providers: [
    {
      provide: 'ddp.config',
      useValue: sdkConfig
    },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: toolkitConfig
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
  constructor(
    private router: Router,
    private analytics: GoogleAnalyticsEventsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.analytics.emitNavigationEvent();
      }
    });
  }
}
