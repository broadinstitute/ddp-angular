import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { DdpModule, AnalyticsEventsService } from 'ddp-sdk';

// Services
import { WorkflowMapperService } from './services/workflowMapper.service';
import { WorkflowBuilderService } from './services/workflowBuilder.service';
import { CommunicationService } from './services/communication.service';
import { ToolkitConfigurationService } from './services/toolkitConfiguration.service';
import { HeaderConfigurationService } from './services/headerConfiguration.service';

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WorkflowStartActivityComponent } from './components/activity/workflow-start-activity.component';
import { WorkflowStartActivityRedesignedComponent } from './components/activity/workflow-start-activity-redesigned.component';
import { ActivityPageComponent } from './components/activity/activity-page.component';
import { ActivityPageRedesignedComponent } from './components/activity/activity-page-redesigned.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ActivityRedesignedComponent } from './components/activity/activity-redesigned.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashboardRedesignedComponent } from './components/dashboard/dashboard-redesigned.component';
import { LoginLandingComponent } from './components/login-landing/login-landing.component';
import { LoginLandingRedesignedComponent } from './components/login-landing/login-landing-redesigned.component';
import { AdminLoginLandingComponent } from './components/login-landing/admin-login-landing.component';
import { ErrorComponent } from './components/error/error.component';
import { ErrorRedesignedComponent } from './components/error/error-redesigned.component';
import { DisclaimerComponent } from './components/dialogs/disclaimer.component';
import { JoinMailingListComponent } from './components/dialogs/joinMailingList.component';
import { StayInformedComponent } from './components/stay-informed/stay-informed.component';
import { StayInformedRedesignedComponent } from './components/stay-informed/stay-informed-redesigned.component';
import { ResendEmailComponent } from './components/dialogs/resendEmail.component';
import { PasswordComponent } from './components/password/password.component';
import { PasswordRedesignedComponent } from './components/password/password-redesigned.component';
import { RedirectToLoginLandingComponent } from './components/redirect-to-login-landing/redirect-to-login-landing.component';
import { RedirectToLoginLandingRedesignedComponent } from './components/redirect-to-login-landing/redirect-to-login-landing-redesigned.component';
import { LovedOneThankYouComponent } from './components/thank-you/loved-one-thank-you.component';
import { LovedOneThankYouRedesignedComponent } from './components/thank-you/loved-one-thank-you-redesigned.component';
import { CommonLandingComponent } from './components/common-landing/common-landing.component';
import { CommonLandingRedesignedComponent } from './components/common-landing/common-landing-redesigned.component';
import { WarningComponent } from './components/dialogs/warning.component';
import { WarningMessageComponent } from './components/warning-message/warning-message.component';
import { AppComponent } from './components/app/app.component';
import { ActivityLinkComponent } from './components/activity/activity-link.component';
import { InternationalPatientsComponent } from './components/international-patients/internationalPatients.component';
import { SessionExpiredComponent } from './components/session-expired/session-expired.component';
import { SessionExpiredRedesignedComponent } from './components/session-expired/session-expired-redesigned.component';
import { RedirectToAuth0LoginComponent } from './components/redirect-to-auth0-login/redirect-to-auth0-login.component';
import { RedirectToAuth0LoginRedesignedComponent } from './components/redirect-to-auth0-login/redirect-to-auth0-login-redesigned.component';
import { SessionWillExpireComponent } from './components/dialogs/sessionWillExpire.component';
import { VerifyAgeUpPageComponent } from './components/age-up/verifyAgeUpPage.component';
import { AcceptAgeUpPageComponent } from './components/age-up/acceptAgeUpPage.component';
import { AgeUpThankYou } from './components/thank-you/age-up-thank-you.component';

// Guards
import { HeaderActionGuard } from './guards/headerAction.guard';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { InstagramFeedLightwidgetPluginComponent } from './components/instagram-feed-lightwidget-plugin/instagram-feed-lightwidget-plugin.component';
import {ServerMessageComponent} from "./components/dialogs/serverMessage.component";

@NgModule({
  imports: [
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
    MatSidenavModule,
    MatButtonModule,
    MatProgressBarModule,
    DdpModule
  ],
  providers: [
    CommunicationService,
    ToolkitConfigurationService,
    HeaderConfigurationService,
    WorkflowBuilderService,
    WorkflowMapperService,
    HeaderActionGuard
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    WorkflowStartActivityComponent,
    WorkflowStartActivityRedesignedComponent,
    ActivityPageComponent,
    ActivityPageRedesignedComponent,
    ActivityComponent,
    ActivityRedesignedComponent,
    DashboardComponent,
    DashboardRedesignedComponent,
    LoginLandingComponent,
    LoginLandingRedesignedComponent,
    AdminLoginLandingComponent,
    CommonLandingComponent,
    CommonLandingRedesignedComponent,
    RedirectToLoginLandingComponent,
    RedirectToLoginLandingRedesignedComponent,
    ErrorComponent,
    ErrorRedesignedComponent,
    DisclaimerComponent,
    JoinMailingListComponent,
    StayInformedComponent,
    StayInformedRedesignedComponent,
    ResendEmailComponent,
    PasswordComponent,
    PasswordRedesignedComponent,
    LovedOneThankYouComponent,
    LovedOneThankYouRedesignedComponent,
    WarningComponent,
    ServerMessageComponent,
    WarningMessageComponent,
    AppComponent,
    ActivityLinkComponent,
    InternationalPatientsComponent,
    SessionExpiredComponent,
    SessionExpiredRedesignedComponent,
    RedirectToAuth0LoginComponent,
    RedirectToAuth0LoginRedesignedComponent,
    SessionWillExpireComponent,
    VerifyAgeUpPageComponent,
    AcceptAgeUpPageComponent,
    AgeUpThankYou,
    InstagramFeedLightwidgetPluginComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    WorkflowStartActivityComponent,
    WorkflowStartActivityRedesignedComponent,
    ActivityPageComponent,
    ActivityPageRedesignedComponent,
    ActivityComponent,
    ActivityRedesignedComponent,
    DashboardComponent,
    DashboardRedesignedComponent,
    LoginLandingComponent,
    LoginLandingRedesignedComponent,
    AdminLoginLandingComponent,
    RedirectToLoginLandingComponent,
    RedirectToLoginLandingRedesignedComponent,
    ErrorComponent,
    ErrorRedesignedComponent,
    StayInformedComponent,
    StayInformedRedesignedComponent,
    PasswordComponent,
    PasswordRedesignedComponent,
    LovedOneThankYouComponent,
    LovedOneThankYouRedesignedComponent,
    WarningMessageComponent,
    ServerMessageComponent,
    AppComponent,
    ActivityLinkComponent,
    InternationalPatientsComponent,
    SessionExpiredComponent,
    SessionExpiredRedesignedComponent,
    RedirectToAuth0LoginComponent,
    RedirectToAuth0LoginRedesignedComponent,
    VerifyAgeUpPageComponent,
    AcceptAgeUpPageComponent,
    AgeUpThankYou,
    InstagramFeedLightwidgetPluginComponent
  ],
  entryComponents: [
    DisclaimerComponent,
    JoinMailingListComponent,
    ResendEmailComponent,
    WarningComponent,
    ServerMessageComponent,
    SessionWillExpireComponent
  ]
})
export class ToolkitModule {
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
