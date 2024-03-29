import { AnalyticsEventsService, DdpModule } from 'ddp-sdk';
import { ToolkitModule } from 'toolkit';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SDKConfigProvider } from './config/sdk.provider';
import { BrowserModule } from '@angular/platform-browser';
import { ClipboardModule } from '@angular/cdk/clipboard';

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
import { AcceptAgeUpComponent } from './components/pages/accept-age-up/accept-age-up.component';
import { VerifyAgeUpComponent } from './components/pages/verify-age-up/verify-age-up.component';
import { PreScreeningComponent } from './components/pages/pre-screening/pre-screening.component';
import { ActivitiesListComponent } from './components/activities-list/activities-list.component';
import { RedirectToLoginComponent } from './components/redirect-to-login/redirect-to-login.component';
import { SessionExpiredComponent } from './components/pages/session-expired/session-expired.component';
import { ParticipantsListComponent } from './components/pages/participant-list/participant-list.component';
import { NotificationsDialogComponent } from './components/notifications-dialog/notifications-dialog.component';
import { SessionExpiredDialogComponent } from './components/session-expired-dialog/session-expired-dialog.component';
import { ParticipantDeletionDialogComponent } from './components/participant-deletion-dialog/participant-deletion-dialog.component';
import { ForResearchesComponent } from './components/pages/for-researches/for-researches.component';
import { ForCliniciansComponent } from './components/pages/for-clinicians/for-clinicians.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { SuccessMessageDialogComponent } from './components/success-message-dialog/success-message-dialog.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { LoginComponent } from './components/login/login.component';
import { ActivitySectionProgressBarComponent } from './components/activity-section-progress-bar/activity-section-progress-bar.component';
import { ActivitySectionPageProgressComponent } from './components/activity-section-page-progress/activity-section-page-progress.component';
import { VideoIntroComponent } from './components/video-intro/video-intro.component';
import { FamilyEnrollmentMessageComponent } from './components/family-enrollment-message/family-enrollment-message.component';
import { FeatureFlagsToggleComponent } from './components/feature-flags-toggle/feature-flags-toggle.component';


declare const gtag: (...args: any[]) => void;

@NgModule({
    declarations: [
        FaqComponent,
        AppComponent,
        HomeComponent,
        LoginComponent,
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
        NotificationsComponent,
        SessionExpiredComponent,
        ActivitiesListComponent,
        RedirectToLoginComponent,
        ParticipantsListComponent,
        NotificationsDialogComponent,
        SessionExpiredDialogComponent,
        ParticipantDeletionDialogComponent,
        ForResearchesComponent,
        ForCliniciansComponent,
        SuccessMessageComponent,
        SuccessMessageDialogComponent,
        ActivitySectionProgressBarComponent,
        ActivitySectionPageProgressComponent,
        VideoIntroComponent,
        FamilyEnrollmentMessageComponent,
        FeatureFlagsToggleComponent
    ],
    imports: [
        DdpModule,
        BrowserModule,
        BrowserAnimationsModule,
        ToolkitModule,
        MaterialModule,
        RecaptchaModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        ClipboardModule
    ],
    providers: [SDKConfigProvider, toolkitConfigProvider, translateProvider],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private analytics: AnalyticsEventsService) {
    }
}
