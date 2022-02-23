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
import {
    RedirectToLoginLandingRedesignedComponent
} from './components/redirect-to-login-landing/redirect-to-login-landing-redesigned.component';
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
import { AgeUpThankYouComponent } from './components/thank-you/age-up-thank-you.component';
import {
    InstagramFeedLightwidgetPluginComponent
} from './components/instagram-feed-lightwidget-plugin/instagram-feed-lightwidget-plugin.component';
import { TwitterTimelineWidgetComponent } from './components/twitter-widget/twitter-timeline-widget.component';
import { CookiesManagementService } from './services/cookiesManagement.service';
import { AnalyticsManagementService } from './services/analyticsManagement.service';
import { CookiesBannerComponent } from './components/cookies/cookiesBanner/cookiesBanner.component';
import { CookiesPreferencesButtonComponent } from './components/cookies/cookiesPreferencesModal/cookiesPreferencesButton.component';
import { CookiesPreferencesModalComponent } from './components/cookies/cookiesPreferencesModal/cookiesPreferencesModal.component';
import { CookiesConsentGuard } from './guards/cookiesConsent.guard';
import { PrivacyPolicyButtonComponent } from './components/privacy-policy/privacyPolicyButton.component';
import { PrivacyPolicyModalComponent } from './components/privacy-policy/privacyPolicyModal.component';
import { PrionPrivacyPolicyComponent } from './components/privacy-policy/prionPrivacyPolicy.component';
import { ModalActivityButtonComponent } from './components/activity/modal-activity-button.component';
import { ModalActivityComponent } from './components/activity/modal-activity.component';
import { ThankYouFamilyHistoryComponent } from './components/thank-you/thank-you-family-history/thank-you-family-history.component';

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
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { AppRedesignedBaseComponent } from './components/app/app-redesigned-base.component';

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
        DdpModule,
        TranslateModule,
        MatTabsModule,
        MatTableModule,
        MatRadioModule,
        MatCheckboxModule,
        MatExpansionModule
    ],
    providers: [
        CommunicationService,
        ToolkitConfigurationService,
        HeaderConfigurationService,
        WorkflowBuilderService,
        WorkflowMapperService,
        HeaderActionGuard,
        CookiesConsentGuard,
        CookiesManagementService,
        AnalyticsManagementService
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
        AgeUpThankYouComponent,
        InstagramFeedLightwidgetPluginComponent,
        TwitterTimelineWidgetComponent,
        CookiesBannerComponent,
        CookiesPreferencesButtonComponent,
        CookiesPreferencesModalComponent,
        PrivacyPolicyButtonComponent,
        PrivacyPolicyModalComponent,
        PrionPrivacyPolicyComponent,
        ModalActivityButtonComponent,
        ModalActivityComponent,
        ThankYouFamilyHistoryComponent,
        AppRedesignedBaseComponent
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
        AppComponent,
        ActivityLinkComponent,
        InternationalPatientsComponent,
        SessionExpiredComponent,
        SessionExpiredRedesignedComponent,
        RedirectToAuth0LoginComponent,
        RedirectToAuth0LoginRedesignedComponent,
        VerifyAgeUpPageComponent,
        AcceptAgeUpPageComponent,
        AgeUpThankYouComponent,
        InstagramFeedLightwidgetPluginComponent,
        TwitterTimelineWidgetComponent,
        CommonLandingComponent,
        CommonLandingRedesignedComponent,
        CookiesBannerComponent,
        PrionPrivacyPolicyComponent,
        ThankYouFamilyHistoryComponent,
        AppRedesignedBaseComponent
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
