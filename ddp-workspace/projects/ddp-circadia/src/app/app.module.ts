import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe, LOCATION_INITIALIZED } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import {
  DdpModule,
  ConfigurationService,
  LoggingService,
  LanguageService,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { ActivityComponent } from './components/activity/activity.component';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MailingListModalComponent } from './components/mailing-list-modal/mailing-list-modal.component';
import { ActivityPageComponent } from './components/pages/activity-page/activity-page.component';
import { Auth0CodeCallbackComponent } from './components/pages/auth0-code-callback/auth0-code-callback.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { HomeComponent } from './components/pages/home/home.component';
import { IrbPasswordComponent } from './components/pages/irb-password/irb-password.component';
import { JoinUsComponent } from './components/pages/join-us/join-us.component';
import { LoginLandingComponent } from './components/pages/login-landing/login-landing.component';
import { SessionExpiredComponent } from './components/pages/session-expired/session-expired.component';
import { StayInformedComponent } from './components/pages/stay-informed/stay-informed.component';
import { SessionWillExpireComponent } from './components/session-will-expire/session-will-expire.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { Route } from './constants/route';
import { AppRoutingModule } from './app-routing.module';

declare const DDP_ENV: any;

const base = document.querySelector('base').getAttribute('href') || '';

export const sdkConfig = new ConfigurationService();
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.logLevel = DDP_ENV.logLevel;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
sdkConfig.doCloudLogging = DDP_ENV.doCloudLogging;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.defaultLanguageCode = 'en';
sdkConfig.baseUrl = location.origin + base;
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.errorPageUrl = Route.Error;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.passwordPageUrl = Route.Password;
sdkConfig.dashboardPageUrl = Route.Dashboard;
sdkConfig.sessionExpiredUrl = Route.SessionExpired;
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.scrollToErrorOffset = 100;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.errorUrl = Route.Error;
toolkitConfig.dashboardUrl = Route.Dashboard;
toolkitConfig.activityUrl = Route.Activity;

export function translateFactory(
  inj: Injector,
  languageService: LanguageService,
  translateService: TranslateService,
  loggingService: LoggingService,
): () => Promise<any> {
  return () =>
    new Promise<any>(resolve => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = inj.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      );

      locationInitialized.then(() => {
        const locale = languageService.getAppLanguageCode();

        translateService.setDefaultLang(locale);

        translateService.use(locale).subscribe(
          () => {
            loggingService.logEvent(
              LOG_SOURCE,
              `Successfully initialized '${locale}' language as default.`,
            );
          },
          err => {
            loggingService.logError(
              LOG_SOURCE,
              `Problem with '${locale}' language initialization:`,
              err,
            );
          },
          () => {
            resolve(null);
          },
        );
      });
    });
}

@NgModule({
  declarations: [
    ActivityComponent,
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MailingListModalComponent,
    ActivityPageComponent,
    Auth0CodeCallbackComponent,
    DashboardComponent,
    ErrorComponent,
    HomeComponent,
    IrbPasswordComponent,
    JoinUsComponent,
    LoginLandingComponent,
    SessionExpiredComponent,
    StayInformedComponent,
    SessionWillExpireComponent,
    UserActivitiesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    DdpModule,
    ToolkitModule,
    AppRoutingModule,
  ],
  providers: [
    DatePipe,
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
