import { DdpModule } from 'ddp-sdk';
import { ToolkitModule } from 'toolkit';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SDKConfigProvider } from './config/sdk.provider';
import { BrowserModule } from '@angular/platform-browser';
import { translateProvider } from './config/translate.provider';
import { toolkitConfigProvider } from './config/toolkit.provider';
import { FaqComponent } from './components/pages/faq/faq.component';
import { MaterialModule } from './modules/material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ErrorComponent } from './components/pages/error/error.component';
import { AboutUsComponent } from './components/pages/about-us/about-us.component';
import { ActivityComponent } from './components/activity/activity.component';
import { SurveyComponent } from './components/pages/survey/survey.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ActivityPageComponent } from './components/pages/activity/activity-page.component';
import { AcceptAgeUpComponent } from './components/pages/accept-age-up/accept-age-up.component';
import { VerifyAgeUpComponent } from './components/pages/verify-age-up/verify-age-up.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { ActivitiesListComponent } from './components/activities-list/activities-list.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { SessionExpiredComponent } from './components/pages/session-expired/session-expired.component';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';
import { ParticipantsListComponent } from './components/pages/participant-list/participant-list.component';
import { NotificationsDialogComponent } from './components/notifications-dialog/notifications-dialog.component';
import { SessionExpiredDialogComponent } from './components/session-expired-dialog/session-expired-dialog.component';
import { ParticipantDeletionDialogComponent } from './components/participant-deletion-dialog/participant-deletion-dialog.component';


@NgModule({
  declarations: [
    FaqComponent,
    AppComponent,
    HomeComponent,
    ErrorComponent,
    HeaderComponent,
    FooterComponent,
    SurveyComponent,
    AboutUsComponent,
    PasswordComponent,
    ActivityComponent,
    AcceptAgeUpComponent,
    VerifyAgeUpComponent,
    ProgressBarComponent,
    PreScreeningComponent,
    ActivityPageComponent,
    SessionExpiredComponent,
    UserActivitiesComponent,
    ActivitiesListComponent,
    RedirectToLoginComponent,
    ParticipantsListComponent,
    WorkflowProgressComponent,
    NotificationsDialogComponent,
    SessionExpiredDialogComponent,
    ParticipantDeletionDialogComponent,
  ],
  imports: [
    DdpModule,
    BrowserModule,
    ToolkitModule,
    MaterialModule,
    RecaptchaModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [SDKConfigProvider, toolkitConfigProvider, translateProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
