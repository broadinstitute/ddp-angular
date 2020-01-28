import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Modules
import { DdpModule } from 'ddp-sdk';

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
import { ActivityPageComponent } from './components/activity/activity-page.component';
import { ActivityPageRedesignedComponent } from './components/activity/activity-page-redesigned.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ActivityRedesignedComponent } from './components/activity/activity-redesigned.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginLandingComponent } from './components/login-landing/loginLanding.component';
import { ErrorComponent } from './components/error/error.component';
import { DisclaimerComponent } from './components/dialogs/disclaimer.component';
import { JoinMailingListComponent } from './components/dialogs/joinMailingList.component';
import { StayInformedComponent } from './components/stay-informed/stayInformed.component';
import { ResendEmailComponent } from './components/dialogs/resendEmail.component';
import { PasswordComponent } from './components/password/password.component';
import { RedirectToLoginLandingComponent } from './components/redirect-to-login-landing/redirectToLoginLanding.component';
import { LovedOneThankYouComponent } from './components/thank-you/lovedOneThankYou.component';
import { CommonLandingComponent } from './components/common-landing/commonLanding.component';
import { CommonLandingRedesignedComponent } from './components/common-landing/commonLandingRedesigned.component';
import { WarningComponent } from './components/dialogs/warning.component';
import { WarningMessageComponent } from './components/warning-message/warning-message.component';
import { AppComponent } from './components/app/app.component';
import { ActivityLinkComponent } from './components/activity/activity-link.component';
import { InternationalPatientsComponent } from './components/international-patients/internationalPatients.component';
import { SessionExpiredComponent } from './components/session-expired/sessionExpired.component';
import { RedirectToAuth0LoginComponent } from './components/redirect-to-auth0-login/redirectToAuth0Login.component';
import { SessionWillExpireComponent } from './components/dialogs/sessionWillExpire.component';
import { VerifyAgeUpPageComponent } from './components/age-up/verifyAgeUpPage.component';
import { AcceptAgeUpPageComponent } from './components/age-up/acceptAgeUpPage.component';
import { AgeUpThankYou } from './components/thank-you/ageUpThankYou.component';

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
import { InstagramFeedLightwidgetPluginComponent } from './components/instagram-feed-lightwidget-plugin/instagram-feed-lightwidget-plugin.component';

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
    ActivityPageComponent,
    ActivityPageRedesignedComponent,
    ActivityComponent,
    ActivityRedesignedComponent,
    DashboardComponent,
    LoginLandingComponent,
    CommonLandingComponent,
    CommonLandingRedesignedComponent,
    RedirectToLoginLandingComponent,
    ErrorComponent,
    DisclaimerComponent,
    JoinMailingListComponent,
    StayInformedComponent,
    ResendEmailComponent,
    PasswordComponent,
    LovedOneThankYouComponent,
    WarningComponent,
    WarningMessageComponent,
    AppComponent,
    ActivityLinkComponent,
    InternationalPatientsComponent,
    SessionExpiredComponent,
    RedirectToAuth0LoginComponent,
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
    ActivityPageComponent,
    ActivityPageRedesignedComponent,
    ActivityComponent,
    ActivityRedesignedComponent,
    DashboardComponent,
    LoginLandingComponent,
    RedirectToLoginLandingComponent,
    ErrorComponent,
    StayInformedComponent,
    PasswordComponent,
    LovedOneThankYouComponent,
    WarningMessageComponent,
    AppComponent,
    ActivityLinkComponent,
    InternationalPatientsComponent,
    SessionExpiredComponent,
    RedirectToAuth0LoginComponent,
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
    SessionWillExpireComponent
  ]
})
export class ToolkitModule { }
