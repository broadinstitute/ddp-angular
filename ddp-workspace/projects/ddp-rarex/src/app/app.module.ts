import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  LogLevel,
  ConfigurationService,
  AnalyticsEventsService,
  AnalyticsEvent,
  LanguageService,
  LoggingService,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { ActivitiesListComponent } from './components/activities-list/activities-list.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { ActivityRedirectComponent } from './components/activity-redirect/activity-redirect.component';
import { AppComponent } from './components/app/app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginLandingComponent } from './components/login-landing/login-landing.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { ParticipantDeletionDialogComponent } from './components/participant-deletion-dialog/participant-deletion-dialog.component';
import { ParticipantsListComponent } from './components/participants-list/participants-list.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { ShareMyDataComponent } from './components/share-my-data/share-my-data.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';
import { ErrorComponent } from './pages/error/error.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';
import { ActivityCodes } from './constants/activity-codes';
import { RoutePaths } from './router-resources';
import { AppRoutingModule } from './app-routing.module';

declare const DDP_ENV: any;
declare const ga: (type: string, event: AnalyticsEvent) => void;

const base = document.querySelector('base').getAttribute('href');

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.activityUrl = RoutePaths.Activity;
tkCfg.consentGuid = ActivityCodes.SelfConsent;
tkCfg.parentalConsentGuid = ActivityCodes.ParentalConsent;
tkCfg.consentAssentGuid = ActivityCodes.ConsentAssent;
tkCfg.dashboardUrl = RoutePaths.Dashboard;
tkCfg.participantListUrl = RoutePaths.ParticipantsList;

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
config.tooltipIconUrl = 'assets/images/info.png';
config.dashboardShowQuestionCount = true;
config.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
config.projectGcpId = DDP_ENV.projectGcpId;
config.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
config.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
config.doCloudLogging = DDP_ENV.doCloudLogging;
config.usesVerticalStepper = [
  ActivityCodes.HealthAndDevelopment,
  ActivityCodes.ChildQualityOfLife,
  ActivityCodes.PatientQualityOfLife,
  ActivityCodes.QualityOfLife
];
config.fixMissingHouseNumberInAddressForm = true;

export const translateFactory = (
  injector: Injector,
  translateService: TranslateService,
  languageService: LanguageService,
  loggingService: LoggingService,
): (() => Promise<null>) => () =>
  new Promise(resolve => {
    const locationInitialized = injector.get(
      LOCATION_INITIALIZED,
      Promise.resolve(null),
    );

    locationInitialized.then(() => {
      const locale = languageService.getAppLanguageCode();

      translateService.setDefaultLang(locale);
      translateService.use(locale).subscribe(
        () => {
          loggingService.logEvent(
            `Successfully initialized '${locale}' language`,
          );
        },
        err => {
          loggingService.logError(
            `Problem with '${locale}' initialization, error is:`,
            err,
          );
        },
        () => resolve(null),
      );
    });
  });

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
    MatDialogModule,
  ],
  declarations: [
    ActivitiesListComponent,
    ActivityComponent,
    ActivityPageComponent,
    ActivityRedirectComponent,
    AppComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    LoginLandingComponent,
    NotificationsComponent,
    ParticipantDeletionDialogComponent,
    ParticipantsListComponent,
    RedirectToLoginComponent,
    ShareMyDataComponent,
    TopBarComponent,
    WorkflowProgressComponent,
    ErrorComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
  ],
  providers: [
    {
      provide: 'ddp.config',
      useValue: config,
    },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: tkCfg,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [Injector, TranslateService, LanguageService, LoggingService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private analytics: AnalyticsEventsService) {
    this.analytics.analyticEvents.subscribe(e => {
      ga('send', e);
      ga('platform.send', e);
    });
  }
}
