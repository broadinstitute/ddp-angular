import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { DdpModule, ConfigurationService, LanguageService, LoggingService } from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ForYourPhysicianComponent } from './pages/for-your-physician/for-your-physician.component';
import { HomeComponent } from './pages/home/home.component';
import { HowToParticipateComponent } from './pages/how-to-participate/how-to-participate.component';
import { ScientificImpactComponent } from './pages/scientific-impact/scientific-impact.component';
import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { Route } from './constants/Route';
import { AppRoutingModule } from './app-routing.module';

declare const DDP_ENV: Record<string, any>;

const base = document.querySelector('base')?.getAttribute('href') ?? '';

/**
 * SDK Config
 */
const sdkConfig = new ConfigurationService();
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.logLevel = DDP_ENV.logLevel;
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.doCloudLogging = DDP_ENV.doCloudLogging;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLogginUrl;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.defaultLanguageCode = 'en';
sdkConfig.baseUrl = location.origin + base;
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;

/**
 * Toolkit Config
 */
const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.activityUrl = Route.Activity;
toolkitConfig.dashboardUrl = Route.Dashboard;
toolkitConfig.doneUrl = Route.AgeUpThankYouProxy;
toolkitConfig.errorUrl = Route.Error;
toolkitConfig.phone = 'TBD';
toolkitConfig.infoEmail = 'TBD';
toolkitConfig.twitterAccountId = 'TBD';
toolkitConfig.facebookGroupId = 'TBD';
toolkitConfig.countMeInUrl = 'https://joincountmein.org';
toolkitConfig.useMultiParticipantDashboard = true;
toolkitConfig.dashboardDisplayedColumns = ['name', 'summary', 'status', 'actions'];

const translateFactory =
  (
    inj: Injector,
    languageService: LanguageService,
    translateService: TranslateService,
    loggingService: LoggingService,
  ): (() => Promise<any>) =>
  () =>
    new Promise<any>(resolve => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = inj.get(LOCATION_INITIALIZED, Promise.resolve(null));

      locationInitialized.then(() => {
        const locale = languageService.getAppLanguageCode();

        translateService.setDefaultLang(locale);

        translateService.use(locale).subscribe(
          () => {
            loggingService.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
          },
          err => {
            loggingService.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
          },
          () => {
            resolve(null);
          },
        );
      });
    });

@NgModule({
  declarations: [
    AboutComponent,
    FaqComponent,
    ForYourPhysicianComponent,
    HomeComponent,
    HowToParticipateComponent,
    ScientificImpactComponent,
    AppComponent,
    HeaderComponent,
  ],
  imports: [BrowserModule, DdpModule, ToolkitModule, AppRoutingModule],
  providers: [
    {
      provide: 'ddp.config',
      useValue: sdkConfig,
    },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: toolkitConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [Injector, LanguageService, TranslateService, LoggingService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
