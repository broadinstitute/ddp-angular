import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';

import * as Hammer from 'hammerjs';

import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  LogLevel,
  ConfigurationService,
  GoogleAnalyticsEventsService
} from 'ddp-sdk';

import {
  ToolkitModule,
  ToolkitConfigurationService
} from 'toolkit';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { TwitterTimelineWidgetComponent } from './components/twitter-widget/twitter-timeline-widget.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { HeaderComponent } from './components/header/header.component';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';

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
tkCfg.internationalPatientsUrl = 'international-patients';
tkCfg.phone = '651-602-2020';
tkCfg.infoEmail = 'info@osproject.org';
tkCfg.twitterAccountId = 'the_osproject';
tkCfg.facebookGroupId = 'osteosarcomaproject';
tkCfg.instagramId = 'osteosarcomaproject';
// to configure feed, go to: https://lightwidget.com/widget-info/814feee04df55de38ec37791efea075e
// need Instagram credentials for @osteosarcomaproject
tkCfg.lightswitchInstagramWidgetId = '814feee04df55de38ec37791efea075e';
tkCfg.countMeInUrl = 'https://joincountmein.org/';
tkCfg.enableRedesign = true;

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
    CommonModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule,
    MatExpansionModule,
    MatIconModule
  ],
  declarations: [
    WelcomeComponent,
    AppComponent,
    FooterComponent,
    GalleryComponent,
    TwitterTimelineWidgetComponent,
    AboutUsComponent,
    FaqComponent,
    HeaderComponent,
    WorkflowProgressComponent
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
