import { Route } from './constants/route';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { translateFactory } from './util/translateFactory';
import { MaterialModule } from './modules/material/material.module';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { ActivityComponent } from './components/activity/activity.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { LearnMoreComponent } from './components/pages/learn-more/learn-more.component';
import { ConfigurationService, DdpModule, LanguageService, LoggingService } from 'ddp-sdk';
import { ActivityPageComponent } from './components/pages/activity/activity-page.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { StayInformedComponent } from './components/pages/stay-informed/stay-informed.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { ReleaseRequestsComponent } from './components/release-requests/release-requests.component';
import { NotificationsDialogComponent } from './components/notifications-dialog/notifications-dialog.component';


declare const DDP_ENV: any;

const base = document.querySelector('base').getAttribute('href') || '';

/**
 * DDP SDK config
 */
export const ddpCfg = new ConfigurationService();

ddpCfg.studyGuid = DDP_ENV.studyGuid;
ddpCfg.backendUrl = DDP_ENV.basePepperUrl;
ddpCfg.auth0Domain = DDP_ENV.auth0Domain;
ddpCfg.auth0ClientId = DDP_ENV.auth0ClientId;
ddpCfg.baseUrl = location.origin + base;
ddpCfg.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
ddpCfg.loginLandingUrl = DDP_ENV.loginLandingUrl;
ddpCfg.auth0CodeRedirect = ddpCfg.baseUrl + 'auth';
ddpCfg.localRegistrationUrl = ddpCfg.backendUrl + '/pepper/v1/register';
ddpCfg.doLocalRegistration = DDP_ENV.doLocalRegistration;
ddpCfg.mapsApiKey = DDP_ENV.mapsApiKey;
ddpCfg.auth0Audience = DDP_ENV.auth0Audience;
ddpCfg.projectGAToken = DDP_ENV.projectGAToken;
ddpCfg.logLevel = DDP_ENV.logLevel;
ddpCfg.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
ddpCfg.projectGcpId = DDP_ENV.projectGcpId;
ddpCfg.defaultLanguageCode = DDP_ENV.defaultLanguageCode || 'en';
ddpCfg.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
ddpCfg.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
ddpCfg.doCloudLogging = DDP_ENV.doCloudLogging;
ddpCfg.errorPageUrl = Route.Error;
ddpCfg.passwordPageUrl = Route.Password;
ddpCfg.dashboardPageUrl = Route.Dashboard;
ddpCfg.sessionExpiredUrl = Route.SessionExpired;

/**
 * Toolkit config
 */
export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.errorUrl = Route.Error;
tkCfg.dashboardUrl = Route.Dashboard;
tkCfg.activityUrl = Route.Activity;

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    LoginComponent,
    FooterComponent,
    HeaderComponent,
    AboutUsComponent,
    ActivityComponent,
    PasswordComponent,
    LearnMoreComponent,
    DashboardComponent,
    ActivityPageComponent,
    PreScreeningComponent,
    StayInformedComponent,
    UserActivitiesComponent,
    SessionExpiredComponent,
    RedirectToLoginComponent,
    ReleaseRequestsComponent,
    NotificationsDialogComponent,
  ],
  imports: [
    DdpModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToolkitModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: 'ddp.config',
      useValue: ddpCfg,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
