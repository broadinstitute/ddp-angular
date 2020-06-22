import {
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatProgressBar, MatProgressBarModule,
  MatProgressSpinnerModule, MatTableModule,
  MatToolbarModule
} from "@angular/material";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { DdpModule } from "ddp-sdk";
import { PrionToolkitConfigurationService } from "./services/toolkitConfiguration.service";
import { PrionFooterComponent } from "./components/footer/footer.component";
import { PrionHeaderComponent } from "./components/header/header.component";
import {
  ActivityLinkComponent,
  CommonLandingComponent,
  CommunicationService,
  DisclaimerComponent,
  HeaderActionGuard,
  LoginLandingComponent,
  PasswordComponent, RedirectToAuth0LoginComponent,
  RedirectToLoginLandingComponent,
  ResendEmailComponent, WarningComponent, WarningMessageComponent,
  WorkflowBuilderService, WorkflowMapperService,
} from "toolkit";
import { PrionDashboardComponent } from "./components/dashboard/dashboard.component";
import { PrionAppComponent } from "./components/app/app.component";
import { PrionActivityPageComponent } from "./components/activity-page/activityPage.component";
import { PrionActivityComponent } from "./components/activity/activity.component";
import { PrionWorkflowStartActivityComponent } from "./components/workflow-start-activity/workflowStartActivity.component";
import { PrionErrorComponent } from "./components/error/error.component";
import { PrionSessionExpiredComponent } from "./components/session-expired/sessionExpired.component";

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
    PrionToolkitConfigurationService,
    WorkflowBuilderService,
    WorkflowMapperService,
    HeaderActionGuard,
    MatProgressBarModule,
    MatProgressBar
  ],
  declarations: [
    PrionFooterComponent,
    PrionHeaderComponent,
    PrionWorkflowStartActivityComponent,
    PrionActivityPageComponent,
    PrionActivityComponent,
    PrionDashboardComponent,
    LoginLandingComponent,
    CommonLandingComponent,
    RedirectToLoginLandingComponent,
    PrionErrorComponent,
    DisclaimerComponent,
    ResendEmailComponent,
    PasswordComponent,
    WarningComponent,
    WarningMessageComponent,
    PrionAppComponent,
    ActivityLinkComponent,
    PrionSessionExpiredComponent,
    RedirectToAuth0LoginComponent,
  ],
  exports: [
    PrionFooterComponent,
    PrionHeaderComponent,
    PrionWorkflowStartActivityComponent,
    PrionActivityPageComponent,
    PrionActivityComponent,
    PrionDashboardComponent,
    LoginLandingComponent,
    RedirectToLoginLandingComponent,
    PrionErrorComponent,
    PasswordComponent,
    WarningMessageComponent,
    ActivityLinkComponent,
    PrionSessionExpiredComponent,
    RedirectToAuth0LoginComponent,
    PrionAppComponent
  ],
  entryComponents: [
    DisclaimerComponent,
    ResendEmailComponent,
    WarningComponent
  ]
})
export class ToolkitPrionModule { }
