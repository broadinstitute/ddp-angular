import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
} from '@ngx-translate/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import {
  AnalyticsEvent,
  AnalyticsEventsService,
  ConfigurationService,
  DdpModule,
  LanguageService,
  LoggingService,
} from 'ddp-sdk';

import {
  CommunicationService,
  ToolkitConfigurationService,
  ToolkitModule,
} from 'toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AboutInitiativeComponent } from './components/about-initiative/about-initiative';
import { AboutUsComponent } from './components/about-us/about-us';
import { AccountActivatedComponent } from './components/account-activation/accountActivated';
import { AccountActivationRequiredComponent } from './components/account-activation/accountActivationRequired';
import { AtcpActivityBaseComponent } from './components/activityForm/app-atcp-activity-base.component';
import { AtcpActivityComponent } from './components/activityForm/app-atcp-activity.component';
import { AppComponent } from './components/app/app.component';
import { SurveyComponent } from './components/survey/survey.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { DataAccessComponent } from './components/data-access/data-access';
import { FooterComponent } from './components/footer/footer';
import { HeaderComponent } from './components/header/header';
import { JoinUsComponent } from './components/join-us/join-us';
import { ExtractTranslationPathsForArrayPipe } from './components/Pipes/extractTranslationPathsForArrayPipe';
import { ProgressBarComponent } from './components/progress-bar/progress-bar';
import { StatisticsComponent } from './components/statistics/statistics';
import { WelcomeComponent } from './components/welcome/welcome';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress';
import { ParticipantListComponent } from './components/participant-list/participant-list.component';
import * as RouterResource from './router-resources';
import { UserPreferencesServiceAgent } from './services/serviceAgents/userPreferencesServiceAgent';
import { ParticipantListItemComponent } from './components/participant-list/participant-list-item.component';
import { ActivityRedirectComponent } from './components/activity-redirect/activity-redirect.component';
import { MailingListComponent } from './components/mailing-list/mailing-list.component';
import { ActivityPrintComponent } from './components/activity-print/activity-print.component';
import { TooltipButtonComponent } from './components/tooltip-button/tooltip-button.component';

// import of components prepared for SDK and Toolkit, but currently located in atcp project
import { FileUploaderComponent } from './sdk/components/file-uploader.component';
import { ActivityProgressBarComponent } from './sdk/components/activityProgressBar.component';
import { AtcpAuth0CodeCallbackComponent } from './sdk/login/atcp-auth0-code-callback.component';
import { ActivityProgressCalculationService } from './sdk/services/activityProgressCalculation.service';
import { CurrentActivityService } from './sdk/services/currentActivity.service';
import { PopupMessageComponent } from './toolkit/dialogs/popupMessage.component';
import { AtcpLoginLandingRedesignedComponent } from './toolkit/login/atcp-login-landing-redesigned.component';
import { AtcpLoginLandingComponent } from './toolkit/login/atcp-login-landing.component';
import { AtcpCommunicationService } from './toolkit/services/communication.service';
import { AppTranslateLoader } from './translate.loader';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare let DDP_ENV: any;
declare const ga: (...args: any[]) => void;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.dashboardUrl = RouterResource.Dashboard;
tkCfg.participantListUrl = RouterResource.ParticipantList;
tkCfg.errorUrl = RouterResource.Error;
tkCfg.infoEmail = 'support@atfamilies.org';
tkCfg.phone = '+1 954-481-6611';
tkCfg.activityUrl = 'activity';
tkCfg.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;
export const config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = DDP_ENV.studyGuid;
config.logLevel = DDP_ENV.logLevel;
config.baseUrl = location.origin + base;
config.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
config.loginLandingUrl = DDP_ENV.loginLandingUrl;
config.auth0CodeRedirect = location.origin + base + 'auth';
config.localRegistrationUrl = config.backendUrl + '/pepper/v1/register';
config.doLocalRegistration = DDP_ENV.doLocalRegistration;
config.mapsApiKey = DDP_ENV.mapsApiKey;
config.auth0Audience = DDP_ENV.auth0Audience;
config.projectGAToken = DDP_ENV.projectGAToken;
config.defaultLanguageCode = DDP_ENV.defaultLanguageCode
  ? DDP_ENV.defaultLanguageCode
  : 'en';
config.languageSelectorIconURL = 'assets/images/atcp/globe.svg#globe';
config.tooltipIconUrl = '';
config.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
config.projectGcpId = DDP_ENV.projectGcpId;
config.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
config.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
config.doCloudLogging = DDP_ENV.doCloudLogging;

export function translateFactory(
  translate: TranslateService,
  injector: Injector,
  logger: LoggingService,
  languageService: LanguageService,
): () => Promise<any> {
  return () =>
    new Promise<any>(resolve => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      );

      locationInitialized.then(() => {
        const locale = languageService.getAppLanguageCode();

        translate.setDefaultLang(locale);

        translate.use(locale).subscribe({
          next: () => {
            logger.logEvent(
              LOG_SOURCE,
              `Successfully initialized '${locale}' language as default.`,
            );
          },
          error: err => {
            logger.logError(
              LOG_SOURCE,
              `Problem with '${locale}' language initialization:`,
              err,
            );
          },
          complete: () => {
            resolve(null);
          }
        });
      });
    });
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: AppTranslateLoader,
        deps: [HttpClient],
      },
    }),
    RecaptchaV3Module,
  ],
  declarations: [
    WelcomeComponent,
    AppComponent,
    FooterComponent,
    AboutUsComponent,
    AboutInitiativeComponent,
    HeaderComponent,
    AtcpActivityBaseComponent,
    AtcpActivityComponent,
    JoinUsComponent,
    DataAccessComponent,
    SurveyComponent,
    WorkflowProgressComponent,
    StatisticsComponent,
    ProgressBarComponent,
    ExtractTranslationPathsForArrayPipe,
    AccountActivatedComponent,
    AccountActivationRequiredComponent,
    ActivityProgressBarComponent,
    AtcpAuth0CodeCallbackComponent,
    AtcpLoginLandingComponent,
    AtcpLoginLandingRedesignedComponent,
    FileUploaderComponent,
    PopupMessageComponent,
    ParticipantListComponent,
    ParticipantListItemComponent,
    DashboardComponent,
    UserActivitiesComponent,
    ActivityRedirectComponent,
    MailingListComponent,
    ActivityPrintComponent,
    TooltipButtonComponent,
  ],
  providers: [
    CurrentActivityService,
    ActivityProgressCalculationService,
    CommunicationService,
    AtcpCommunicationService,
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
      deps: [TranslateService, Injector, LoggingService, LanguageService],
      multi: true,
    },
    UserPreferencesServiceAgent,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: tkCfg.recaptchaSiteClientKey,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private analytics: AnalyticsEventsService) {
    this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
      ga('send', event);
      ga('platform.send', event);
    });
  }
}
