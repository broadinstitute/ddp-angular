//Angular imports
import {
  MatCardModule, MatDialogModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatProgressBar,
  MatProgressBarModule, MatProgressSpinnerModule, MatTableModule,
  MatToolbarModule
} from "@angular/material";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

//SDK imports
import { AnalyticsEventsService, DdpModule } from "ddp-sdk";

//Toolkit imports
import {
  ActivityLinkComponent,
  CommunicationService,
  DisclaimerComponent,
  HeaderActionGuard,
  LoginLandingComponent,
  RedirectToAuth0LoginComponent,
  RedirectToLoginLandingComponent,
  ResendEmailComponent,
  SessionWillExpireComponent,
  ToolkitModule,
  WarningComponent,
  WarningMessageComponent,
  WorkflowBuilderService,
  WorkflowMapperService
} from "toolkit";

//Local imports
import { PrionToolkitConfigurationService } from "./services/prionToolkitConfiguration.service";
import { PrionFooterComponent } from "./components/footer/prionFooter.component";
import { PrionHeaderComponent } from "./components/header/prionHeader.component";
import { PrionActivityPageComponent } from "./components/activity-page/prionActivityPage.component";
import { PrionWorkflowStartActivityComponent } from "./components/workflow-start-activity/prionWorkflowStartActivity.component";
import { PrionActivityComponent } from "./components/activity/prionActivity.component";
import { PrionDashboardComponent } from "./components/dashboard/prionDashboard.component";
import { PrionErrorComponent } from "./components/error/prionError.component";
import { PrionPasswordComponent } from "./components/password/prionPassword.component";
import { PrionAppComponent } from "./components/app/prionApp.component";
import { PrionSessionExpiredComponent } from "./components/session-expired/prionSessionExpired.component";

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
    MatTableModule,
    DdpModule,
    ToolkitModule
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
    PrionErrorComponent,
    PrionPasswordComponent,
    PrionAppComponent,
    PrionSessionExpiredComponent
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
    PrionPasswordComponent,
    WarningMessageComponent,
    ActivityLinkComponent,
    PrionSessionExpiredComponent,
    RedirectToAuth0LoginComponent,
    PrionAppComponent
  ],
  entryComponents: [
    DisclaimerComponent,
    ResendEmailComponent,
    WarningComponent,
    SessionWillExpireComponent
  ]
})
export class ToolkitPrionModule {
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
