import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import {
  DdpModule,
  ConfigurationService,
  LogLevel,
  AnalyticsEventsService,
  AnalyticsEvent
} from 'ddp-sdk';

import {
  ToolkitModule,
  ToolkitConfigurationService
} from 'toolkit';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { AboutUsDialogComponent } from './components/about-us/dialog/about-us-dialog.component';
import { FaqComponent } from './components/faq/faq.component';
import { PasswordComponent } from './components/password/password.component';
import { EligibilityCriteriaComponent } from './components/eligibility-criteria/eligibility-criteria.component';
import { HowItWorksComponent } from './components/how-it-works/how-it-works.component';
import { PrivacyAndYourDataComponent } from './components/privacy-and-your-data/privacy-and-your-data.component';
import { ForYourPhysicianComponent } from './components/for-your-physician/for-your-physician.component';
import { DataSharingComponent } from './components/data-sharing/data-sharing.component';
import { LGMDComponent } from './components/lgmd/lgmd.component';
import { CraniofacialComponent } from './components/craniofacial/craniofacial.component';
import { StayInformedComponent } from './components/stay-informed/stay-informed.component';
import { ErrorComponent } from './components/error/error.component';
import { TellUsYourStoryComponent } from './components/tell-us-your-story/tell-us-your-story.component';
import { Auth0LandingComponent } from './components/auth0-landing/auth0-landing.component';
import { Auth0RedirectComponent } from './components/auth0-redirect/auth0-redirect.component';
import { RedirectToAuth0Landing } from './components/redirect-to-auth0-landing/redirect-to-auth0-landing.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';

import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.aboutFamily = 'about-your-family';
toolkitConfig.dashboardUrl = 'dashboard';
toolkitConfig.aboutFamilyGuid = ''; // To be defined later
toolkitConfig.dashboardGuid = 'DASHBOARD';
toolkitConfig.stayInformedUrl = 'stay-informed';
toolkitConfig.activityUrl = 'activity';
toolkitConfig.errorUrl = 'error';
toolkitConfig.phone = '617-714-7395';
toolkitConfig.infoEmail = 'raregenomes@broadinstitute.org';
toolkitConfig.facebookGroupId = 'RareGenomesProject';
toolkitConfig.mailingListDialogUrl = 'updates';

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

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
config.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
config.projectGcpId = DDP_ENV.projectGcpId;

export function translateFactory(translate: TranslateService, injector: Injector): () => Promise<any> {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const locale = 'en';
      translate.setDefaultLang(locale);
      translate.use(locale).subscribe(() => {
        console.log(`Successfully initialized '${locale}' language as default.`);
      }, err => {
        console.error(`Problem with '${locale}' language initialization: ${err}.`);
      }, () => {
        resolve(null);
      });
    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    AboutUsDialogComponent,
    FaqComponent,
    PasswordComponent,
    EligibilityCriteriaComponent,
    HowItWorksComponent,
    PrivacyAndYourDataComponent,
    ForYourPhysicianComponent,
    DataSharingComponent,
    LGMDComponent,
    CraniofacialComponent,
    StayInformedComponent,
    ErrorComponent,
    TellUsYourStoryComponent,
    Auth0LandingComponent,
    Auth0RedirectComponent,
    RedirectToAuth0Landing,
    SessionExpiredComponent,
    UserDashboardComponent
  ],
  entryComponents: [
    AboutUsDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule,
    MatIconModule,
    MatDialogModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: 'ddp.config',
      useValue: config
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
  constructor(private analytics: AnalyticsEventsService) {
    this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
      ga('send', event);
      ga('platform.send', event);
    });
  }
}
