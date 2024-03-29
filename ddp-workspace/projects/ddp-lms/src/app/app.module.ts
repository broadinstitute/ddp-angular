import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  ConfigurationService,
  LanguageService,
  LoggingService,
  SubmitAnnouncementService,
  SubmissionManager,
} from 'ddp-sdk';

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
import { FooterComponent } from './components/footer/footer.component';
import { FaqSectionComponent } from './pages/faq-section/faq-section.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NavComponent } from './components/nav/nav.component';
import { loginOutComponent } from './components/nav/loginOut/loginOut.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityPageComponent } from './activity-page/activity-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { MatTableModule } from '@angular/material/table';
import { FlexModule } from '@angular/flex-layout';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';
import { MobileNavComponent } from './components/nav/mobile-nav/mobile-nav.component';
import { FooterNavComponent } from './components/footer/footer-nav/footer-nav.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { WorkflowStartComponent } from './components/workflow-start/workflow-start.component';
import {GovernedUserService} from './services/governed-user.service';
import {PrequalifierService} from './services/prequalifier.service';

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
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.usesVerticalStepper = ['FAMILY_HISTORY', 'FAMILY_HISTORY_SELF', 'FAMILY_HISTORY_PARENTAL'];
sdkConfig.tooltipIconUrl = 'assets/images/info.png';
sdkConfig.dashboardActivitiesStartedStatuses = ['CREATED'];
sdkConfig.dashboardActivitiesCompletedStatuses = ['COMPLETE'];
sdkConfig.institutionsAdditionalFields = { PHYSICIAN: ['COUNTRY'] };

/**
 * Toolkit Config
 */
const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.activityUrl = Route.Activity;
toolkitConfig.dashboardUrl = Route.Dashboard;
toolkitConfig.doneUrl = Route.AgeUpThankYouProxy;
toolkitConfig.errorUrl = Route.Error;
toolkitConfig.phone = '651-403-5556';
toolkitConfig.infoEmail = 'info@lmsproject.org';
toolkitConfig.countMeInUrl = 'https://joincountmein.org';
toolkitConfig.useMultiParticipantDashboard = true;
toolkitConfig.dashboardDisplayedColumns = ['name', 'summary', 'status', 'actions'];
toolkitConfig.mailingListDialogUrl = 'updates';
toolkitConfig.twitterAccountId = 'count_me_in';
toolkitConfig.facebookGroupId = 'joincountmein';
toolkitConfig.instagramId = 'countmein';
toolkitConfig.lightswitchInstagramWidgetId = '814feee04df55de38ec37791efea075e';
toolkitConfig.allowEditUserProfile = false;

const translateFactory =
  (
    inj: Injector,
    languageService: LanguageService,
    translateService: TranslateService,
    loggingService: LoggingService
  ): (() => Promise<any>) =>
  () =>
    new Promise<any>((resolve) => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = inj.get(LOCATION_INITIALIZED, Promise.resolve(null));

      locationInitialized.then(() => {
        const locale = languageService.getAppLanguageCode();
        translateService.setDefaultLang(locale);

        translateService.use(locale).subscribe({
          next: () => {
            loggingService.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
          },
          error: (err) => {
            loggingService.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
          },
          complete: () => {
            resolve(null);
          },
        });
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
    FooterComponent,
    FaqSectionComponent,
    NavComponent,
    loginOutComponent,
    ActivityComponent,
    ActivityPageComponent,
    DashboardComponent,
    UserActivitiesComponent,
    WorkflowProgressComponent,
    MobileNavComponent,
    FooterNavComponent,
    LandingPageComponent,
    WorkflowStartComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DdpModule,
    ToolkitModule,
    AppRoutingModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
    FlexModule,
  ],
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
    SubmitAnnouncementService,
    SubmissionManager,
    GovernedUserService,
    PrequalifierService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
