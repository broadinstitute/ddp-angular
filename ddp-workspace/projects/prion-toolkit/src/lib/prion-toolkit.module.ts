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

// Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { WorkflowStartActivityComponent } from './components/workflow-start-activity/workflowStartActivity.component';
import { ActivityPageComponent } from './components/activity-page/activityPage.component';
import { ActivityComponent } from './components/activity/activity.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginLandingComponent } from './components/login-landing/loginLanding.component';
import { ErrorComponent } from './components/error/error.component';
import { DisclaimerComponent } from './components/dialogs/disclaimer.component';
import { ResendEmailComponent } from './components/dialogs/resendEmail.component';
import { PasswordComponent } from './components/password/password.component';
import { RedirectToLoginLandingComponent } from './components/redirect-to-login-landing/redirectToLoginLanding.component';
import { CommonLandingComponent } from './components/common-landing/commonLanding.component';
import { WarningComponent } from './components/dialogs/warning.component';
import { WarningMessageComponent } from './components/warning-message/warning-message.component';
import { AppComponent } from './components/app/app.component';
import { ActivityLinkComponent } from './components/activity/activityLink.component';
import { SessionExpiredComponent } from './components/session-expired/sessionExpired.component';
import { RedirectToAuth0LoginComponent } from './components/redirect-to-auth0-login/redirectToAuth0Login.component';
import { SessionWillExpireComponent } from './components/dialogs/sessionWillExpire.component';

// Guards
import { HeaderActionGuard } from './guards/headerAction.guard';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from "@angular/material";

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
    DdpModule,
    MatTableModule
  ],
  providers: [
    CommunicationService,
    ToolkitConfigurationService,
    WorkflowBuilderService,
    WorkflowMapperService,
    HeaderActionGuard
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    WorkflowStartActivityComponent,
    ActivityPageComponent,
    ActivityComponent,
    DashboardComponent,
    LoginLandingComponent,
    CommonLandingComponent,
    RedirectToLoginLandingComponent,
    ErrorComponent,
    DisclaimerComponent,
    ResendEmailComponent,
    PasswordComponent,
    WarningComponent,
    WarningMessageComponent,
    AppComponent,
    ActivityLinkComponent,
    SessionExpiredComponent,
    RedirectToAuth0LoginComponent,
    SessionWillExpireComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    WorkflowStartActivityComponent,
    ActivityPageComponent,
    ActivityComponent,
    DashboardComponent,
    LoginLandingComponent,
    RedirectToLoginLandingComponent,
    ErrorComponent,
    PasswordComponent,
    WarningMessageComponent,
    AppComponent,
    ActivityLinkComponent,
    SessionExpiredComponent,
    RedirectToAuth0LoginComponent
  ],
  entryComponents: [
    DisclaimerComponent,
    ResendEmailComponent,
    WarningComponent,
    SessionWillExpireComponent
  ]
})
export class PrionToolkitModule { }
