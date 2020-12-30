// Angular imports
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule, MatProgressBar } from '@angular/material/progress-bar';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

// SDK imports
import { AnalyticsEventsService, DdpModule } from 'ddp-sdk';

// Toolkit imports
import {
  ActivityLinkComponent,
  CommunicationService,
  HeaderActionGuard,
  LoginLandingComponent,
  RedirectToAuth0LoginComponent,
  ToolkitModule,
  WarningMessageComponent,
  WorkflowBuilderService,
  WorkflowMapperService
} from 'toolkit';

// Local imports
import { PrionToolkitConfigurationService } from './services/prionToolkitConfiguration.service';
import { PrionFooterComponent } from './components/footer/prionFooter.component';
import { PrionHeaderComponent } from './components/header/prionHeader.component';
import { PrionActivityPageComponent } from './components/activity-page/prionActivityPage.component';
import { PrionWorkflowStartActivityComponent } from './components/workflow-start-activity/prionWorkflowStartActivity.component';
import { PrionActivityComponent } from './components/activity/prionActivity.component';
import { PrionDashboardComponent } from './components/dashboard/prionDashboard.component';
import { PrionErrorComponent } from './components/error/prionError.component';
import { PrionPasswordComponent } from './components/password/prionPassword.component';
import { PrionAppComponent } from './components/app/prionApp.component';
import { PrionSessionExpiredComponent } from './components/session-expired/prionSessionExpired.component';
import { PrionLoginLandingComponent } from './components/login-landing/prionLoginLanding.component';
import { PrionCommonLandingComponent } from './components/common-landing/prionCommonLanding.component';
import { PrionRedirectToLoginLandingComponent } from './components/redirect-to-login-landing/prionRedirectToLoginLanding.component';
import { PrionRedirectToAuth0LoginComponent } from './components/redirect-to-auth0-login/prionRedirectToAuth0Login.component';

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
    PrionActivityComponent,
    PrionActivityPageComponent,
    PrionAppComponent,
    PrionCommonLandingComponent,
    PrionDashboardComponent,
    PrionErrorComponent,
    PrionFooterComponent,
    PrionHeaderComponent,
    PrionLoginLandingComponent,
    PrionPasswordComponent,
    PrionRedirectToAuth0LoginComponent,
    PrionRedirectToLoginLandingComponent,
    PrionSessionExpiredComponent,
    PrionWorkflowStartActivityComponent
  ],
  exports: [
    ActivityLinkComponent,
    LoginLandingComponent,
    PrionActivityComponent,
    PrionActivityPageComponent,
    PrionAppComponent,
    PrionDashboardComponent,
    PrionErrorComponent,
    PrionFooterComponent,
    PrionHeaderComponent,
    PrionLoginLandingComponent,
    PrionPasswordComponent,
    PrionRedirectToAuth0LoginComponent,
    PrionRedirectToLoginLandingComponent,
    PrionSessionExpiredComponent,
    PrionWorkflowStartActivityComponent,
    RedirectToAuth0LoginComponent,
    WarningMessageComponent
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
