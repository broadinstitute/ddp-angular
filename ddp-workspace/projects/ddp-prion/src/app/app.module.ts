//Angular imports
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule, FlexModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from "@angular/material";

//External library imports
import { TranslateService } from '@ngx-translate/core';

//SDK imports
import { AnalyticsEvent, AnalyticsEventsService, ConfigurationService, DdpModule, LogLevel } from 'ddp-sdk';

//Toolkit imports
import { ToolkitModule } from "toolkit";

//Toolkit-prion imports
import { PrionToolkitConfigurationService,
  ToolkitPrionModule,
  PrionAppComponent
} from "toolkit-prion";

//Local imports
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from "./components/welcome/welcome.component";
import { LearnMoreComponent } from "./components/learn-more/learn-more.component";
import { StudyListingComponent } from "./components/study-listing-component/study-listing.component";
import { RedirectJoinComponent } from "./components/redirect-join/redirect-join.component";
import { PrivacyPolicyFullComponent } from "./components/privacy-policy/privacy-policy-full.component";
import { ThirdPartyComponent } from "./components/third-party/third-party.component";

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: Function;

export const tkCfg = new PrionToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.consentGuid = 'PRIONCONSENT';
tkCfg.releaseGuid = 'PRIONMEDICAL';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.consentUrl = 'consent';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.assetsBucketUrl = 'https://storage.googleapis.com/' + DDP_ENV.assetsBucketName;
tkCfg.infoEmail = 'help@prionregistry.org';

export const config = new ConfigurationService();
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
config.usePrionPrivacyPolicyTemplate = true;
config.cookies = {
  cookies: [
    {
      type: 'Functional',
      actions: null,
      list: [
        {
          name: 'auth0',
          description: null,
          duration: null
        },
        {
          name: 'auth0_com.auth0.auth',
          description: 'authorization',
          duration: '30minutes'
        },
        {
          name: 'pepper',
          description: null,
          duration: null
        },
        {
          name: 'pepper_session_key',
          description: 'authentication',
          duration: 'persistent'
        },
        {
          name: 'pepper_token',
          description: 'authentication',
          duration: 'persistent'
        },
        {
          name: 'pepper_cookie',
          description: 'cookie',
          duration: 'persistent'
        },
        {
          name: 'pepper_studyLanguage',
          description: 'language',
          duration: 'persistent'
        },
        {
          name: 'tcell',
          description: null,
          duration: null
        },
        {
          name: 'tcell_agent_session_id',
          description: 'security',
          duration: 'persistent'
        },
        {
          name: 'tcell_agent_policy_cache',
          description: 'security',
          duration: 'persistent'
        }
      ]
    },
    {
      type: 'Analytical',
      actions: ['Accept', 'Reject'],
      list: [
        {
          name: 'google_analytics',
          description: null,
          duration: null
        },
        {
          name: 'ga',
          description: 'identification',
          duration: '2years'
        },
        {
          name: 'gid',
          description: 'grouping_behavior',
          duration: '24hours'
        },
        {
          name: 'gat',
          description: 'throttling',
          duration: '10minutes'
        },
        {
          name: 'gat_platform',
          description: 'throttling',
          duration: '10minutes'
        }
      ]
    }
  ]
};

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
    ToolkitPrionModule,
    ToolkitModule,
    FlexModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatProgressBarModule,
    MatTableModule
  ],
  declarations: [
    WelcomeComponent,
    LearnMoreComponent,
    StudyListingComponent,
    RedirectJoinComponent,
    PrivacyPolicyFullComponent,
    ThirdPartyComponent
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
  bootstrap: [PrionAppComponent]
})
export class AppModule {
  constructor(private analytics: AnalyticsEventsService) {
    this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
      ga('send', event);
      ga('platform.send', event);
    });
  }
}
