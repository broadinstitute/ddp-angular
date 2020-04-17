import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import * as Hammer from 'hammerjs';

import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  LogLevel,
  ConfigurationService,
  AnalyticsEventsService
} from 'ddp-sdk';

import {
  ToolkitModule,
  ToolkitConfigurationService
} from 'toolkit';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { WelcomeComponent } from './components/welcome/welcome';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer';
import { AboutUsComponent } from './components/about-us/about-us';
import { HeaderComponent } from './components/header/header';
import { MatMenuModule } from '@angular/material';
import { LanguagesProvider } from './providers/languages.provider';
import { JoinUsComponent } from './components/join-us/join-us';
import { AboutInitiativeComponent } from './components/about-initiative/about-initiative';
import { DataAccessComponent } from './components/data-access/data-access';
import { PasswordComponent } from './components/password/password';
import { DashBoardComponent } from './components/dashboard/dashboard';
import { ActivityComponent } from './components/activity/activity';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress';
import { ErrorComponent } from './components/error/error';
import { StatisticsComponent } from './components/statistics/statistics';
import { ProgressBarComponent } from './components/progress-bar/progress-bar';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare let DDP_ENV: any;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.aboutYouGuid = 'ABOUTYOU';
tkCfg.aboutChildGuid = 'ABOUTCHILD';
tkCfg.consentGuid = 'CONSENT';
tkCfg.consentAssentGuid = 'CONSENT_ASSENT';
tkCfg.parentalConsentGuid = 'PARENTAL_CONSENT';
tkCfg.releaseGuid = 'RELEASE_SELF';
tkCfg.releaseMinorGuid = 'RELEASE_MINOR';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.lovedOneGuid = 'LOVEDONE';
tkCfg.lovedOneThankYouGuid = 'THANK_YOU';
tkCfg.aboutYouUrl = 'about-you';
tkCfg.aboutChildUrl = 'about-your-child';
tkCfg.lovedOneUrl = 'loved-one';
tkCfg.consentUrl = 'consent';
tkCfg.consentAssentUrl = 'consent-assent';
tkCfg.parentalConsentUrl = 'parental-consent';
tkCfg.releaseMinorUrl = 'release-minor-survey';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.doneUrl = 'proxy-thank-you';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.stayInformedUrl = 'stay-informed';
tkCfg.lovedOneThankYouUrl = 'loved-one-thank-you';
tkCfg.infoEmail = 'bistline@broadinstitute.org';
tkCfg.twitterAccountId = 'the_osproject';
tkCfg.facebookGroupId = 'osteosarcomaproject';
tkCfg.instagramId = 'the_osproject';
// to configure feed, go to: https://lightwidget.com/widget-info/814feee04df55de38ec37791efea075e
// need Instagram credentials for @osteosarcomaproject
tkCfg.lightswitchInstagramWidgetId = '814feee04df55de38ec37791efea075e';
tkCfg.countMeInUrl = 'https://joincountmein.org/';

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

export class MyHammerConfig extends HammerGestureConfig {
  public buildHammer(element: HTMLElement): Hammer {
    const hammer = new Hammer(element, {
      touchAction: 'pan-y'
    });
    return hammer;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule
  ],
  declarations: [
    WelcomeComponent,
    AppComponent,
    FooterComponent,
    AboutUsComponent,
    AboutInitiativeComponent,
    HeaderComponent,
    JoinUsComponent,
    DataAccessComponent,
    PasswordComponent,
    DashBoardComponent,
    ActivityComponent,
    WorkflowProgressComponent,
    ErrorComponent,
    StatisticsComponent,
    ProgressBarComponent
  ],
  entryComponents: [
    DashBoardComponent,
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
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    LanguagesProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private router: Router,
    private analytics: AnalyticsEventsService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.analytics.emitNavigationEvent();
      }
    });
  }
}
