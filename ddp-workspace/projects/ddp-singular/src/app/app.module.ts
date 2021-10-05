import { DdpModule } from 'ddp-sdk';
import { ToolkitModule } from 'toolkit';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SDKConfigProvider } from './config/sdk.provider';
import { BrowserModule } from '@angular/platform-browser';
import { translateProvider } from './config/translate.provider';
import { toolkitConfigProvider } from './config/toolkit.provider';
import { MaterialModule } from './modules/material/material.module';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ActivityComponent } from './components/activity/activity.component';
import { SurveyComponent } from './components/pages/survey/survey.component';
import { PasswordComponent } from './components/pages/password/password.component';
import { ActivityPageComponent } from './components/pages/activity/activity-page.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { ActivitiesListComponent } from './components/activities-list/activities-list.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';
import { ParticipantsListComponent } from './components/pages/participant-list/participant-list.component';
import { NotificationsDialogComponent } from './components/notifications-dialog/notifications-dialog.component';
import { ParticipantDeletionDialogComponent } from './components/participant-deletion-dialog/participant-deletion-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SurveyComponent,
    AboutUsComponent,
    PasswordComponent,
    ActivityComponent,
    PreScreeningComponent,
    ActivityPageComponent,
    UserActivitiesComponent,
    ActivitiesListComponent,
    RedirectToLoginComponent,
    ParticipantsListComponent,
    WorkflowProgressComponent,
    NotificationsDialogComponent,
    ParticipantDeletionDialogComponent,
  ],
  imports: [
    DdpModule,
    BrowserModule,
    ToolkitModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [SDKConfigProvider, toolkitConfigProvider, translateProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
