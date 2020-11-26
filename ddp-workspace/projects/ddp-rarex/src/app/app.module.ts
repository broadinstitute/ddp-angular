import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatIconModule } from '@angular/material';
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
  ToolkitConfigurationService
} from 'toolkit';

import { AppComponent } from './components/app/app.component';
import { RarexDashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RarexActivityComponent } from './components/rarex-activity/rarex-activity.component';
import { RarexActivityPageComponent } from './components/rarex-activity-page/rarex-activity-page.component';
import { RarexActivityRedirectComponent } from './components/rarex-activity-redirect/rarex-activity-redirect.component';
import { ShareMyDataComponent } from './components/share-my-data/share-my-data.component';
import { PrivacyPolicyPageComponent, TermsConditionsPageComponent } from './components/static';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';
import { ActivityCodes } from './constants/activity-codes';
import { RoutePaths } from './router-resources';
import { AppRoutingModule } from './app-routing.module';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: Function;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.activityUrl = RoutePaths.Activity;
tkCfg.dashboardUrl = RoutePaths.Dashboard;
tkCfg.consentUrl = RoutePaths.Consent;
tkCfg.parentalConsentUrl = RoutePaths.ParentalConsent;
tkCfg.consentAssentUrl = RoutePaths.ConsentAssent;
tkCfg.consentGuid = ActivityCodes.CONSENT;
tkCfg.parentalConsentGuid = ActivityCodes.PARENTAL_CONSENT;
tkCfg.consentAssentGuid = ActivityCodes.CONSENT_ASSENT;
tkCfg.dashboardDisplayedColumns = ['name', 'summary', 'date', 'status', 'actions'];

export let config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = DDP_ENV.studyGuid;
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
config.tooltipIconUrl = 'assets/images/info.png';
config.dashboardShowQuestionCount = true;
config.dashboardShowQuestionCountExceptions = [ActivityCodes.CONSENT, ActivityCodes.CONSENT_ASSENT];

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
    CommonModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
  ],
  declarations: [
    AppComponent,
    RarexDashboardComponent,
    FooterComponent,
    HeaderComponent,
    WorkflowProgressComponent,
    RarexActivityPageComponent,
    RarexActivityComponent,
    RarexActivityRedirectComponent,
    ShareMyDataComponent,
    TopBarComponent,
    PrivacyPolicyPageComponent,
    TermsConditionsPageComponent,
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
