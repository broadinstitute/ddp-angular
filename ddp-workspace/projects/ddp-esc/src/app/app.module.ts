import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  ConfigurationService,
  AnalyticsEventsService,
  AnalyticsEvent,
  LoggingService
} from 'ddp-sdk';

import {
  ToolkitModule,
  ToolkitConfigurationService,
  AppComponent
} from 'toolkit';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.aboutYouGuid = 'ABOUTYOU';
toolkitConfig.consentGuid = 'CONSENT';
toolkitConfig.releaseGuid = 'RELEASE';
toolkitConfig.followupGuid = 'FOLLOWUPCONSENT';
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
toolkitConfig.mailingListDialogUrl = 'updates';
toolkitConfig.phone = '651-229-6991';
toolkitConfig.infoEmail = 'info@escproject.org';
toolkitConfig.dataEmail = 'data@escproject.org';
toolkitConfig.twitterAccountId = 'ecscproject';
toolkitConfig.facebookGroupId = 'ecscproject';
toolkitConfig.countMeInUrl = 'https://joincountmein.org/';
toolkitConfig.showDataRelease = true;
toolkitConfig.showInfoForPhysicians = true;
toolkitConfig.showBlog = false;

export const sdkConfig = new ConfigurationService();
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.logLevel = DDP_ENV.logLevel;
sdkConfig.baseUrl = location.origin + base;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
sdkConfig.doCloudLogging = DDP_ENV.doCloudLogging;

export function translateFactory(translate: TranslateService, injector: Injector, logger: LoggingService): () => Promise<any> {
  return () => new Promise<any>((resolve: any) => {
    const LOG_SOURCE = 'AppModule';
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const locale = 'en';
      translate.setDefaultLang(locale);
      translate.use(locale).subscribe(() => {
        logger.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
      }, err => {
        logger.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
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
    MoreDetailsComponent,
    AboutUsComponent,
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
        Injector,
        LoggingService
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
