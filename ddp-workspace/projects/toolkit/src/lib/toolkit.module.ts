import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

// Modules
import { AnalyticsEventsService } from '../../../ddp-sdk/src/lib/services/analyticsEvents.service';
import { DdpUserMenuModule } from '../../../ddp-sdk/src/lib/components/user/user-menu/user-menu.module';
import { WarningMessageModule } from './components/warning-message/warning-message.module';
import { FooterModule } from './components/footer/footer.module';
// import { DialogsModule } from './components/dialogs/dialogs.module';
// import { ActivityModule } from './components/activity/activity.module';
// import { ActivityPageModule } from './components/activity/activity-page/activity-page.module';
// import { ActivityPageRedesignedModule } from './components/activity/activity-page-redesigned/activity-page-redesigned.module';
// import { AgeUpModule } from './components/age-up/age-up.module';
// import { CommonLandingModule } from './components/common-landing/common-landing.module';
// import { CookiesBannerModule } from './components/cookies/cookiesBanner/cookies-banner.module';
// import { CookiesPreferencesModalModule } from './components/cookies/cookiesPreferencesModal/cookies-preferences-modal.module';
// import { DashboardModule } from './components/dashboard/dashboard.module';
// import { DashboardRedesignedModule } from './components/dashboard-redesigned/dashboard-redesigned.module';
// import { ErrorModule } from './components/error/error.module';
// import { InstagramFeedLightwidgetPluginModule } from './components/instagram-feed-lightwidget-plugin/instagram-feed-lightwidget-plugin.module';
// import { HeaderModule } from './components/header/header.module';
// import { InternationalPatientsModule } from './components/international-patients/international-patients.module';
// import { LoginLandingModule } from './components/login-landing/login-landing.module';
// import { PasswordModule } from './components/password/password.module';
// import { PrivacyPolicyModule } from './components/privacy-policy/privacy-policy.module';
// import { RedirectToAuth0LoginModule } from './components/redirect-to-auth0-login/redirect-to-auth0-login.module';
// import { RedirectToLoginLandingModule } from './components/redirect-to-login-landing/redirect-to-login-landing.module';
// import { SessionExpiredModule } from './components/session-expired/session-expired.module';
// import { StayInformedModule } from './components/stay-informed/stay-informed.module';
// import { ThankYouModule } from './components/thank-you/thank-you.module';
// import { TwitterTimelineWidgetModule } from './components/twitter-widget/twitter-timeline-widget.module';


// Services
import { WorkflowMapperService } from './services/workflowMapper.service';
import { WorkflowBuilderService } from './services/workflowBuilder.service';
import { CommunicationService } from './services/communication.service';
import { ToolkitConfigurationService } from './services/toolkitConfiguration.service';
import { HeaderConfigurationService } from './services/headerConfiguration.service';

// Components
import { AppComponent } from './components/app/app.component';
import { AppRedesignedBaseComponent } from './components/app/app-redesigned-base.component';
import { CookiesManagementService } from './services/cookiesManagement.service';
import { AnalyticsManagementService } from './services/analyticsManagement.service';
import { CookiesConsentGuard } from './guards/cookiesConsent.guard';
import { LazyWidgetComponent } from './components/lazy-widget/lazy-widget.component';

// Guards
import { HeaderActionGuard } from './guards/headerAction.guard';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FooterModule,
    MatSidenavModule,
    // ActivityModule,
    // ActivityPageModule,
    // ActivityPageRedesignedModule,
    // AgeUpModule,
    // CommonLandingModule,
    // CookiesBannerModule,
    // CookiesPreferencesModalModule, // ?
    // DashboardModule,
    // DashboardRedesignedModule,
    // DialogsModule,
    // ErrorModule,
    // HeaderModule,
    // InstagramFeedLightwidgetPluginModule,
    // InternationalPatientsModule,
    // LoginLandingModule,
    // PasswordModule,
    // PrivacyPolicyModule,
    // RedirectToAuth0LoginModule,
    // RedirectToLoginLandingModule, // ?
    // SessionExpiredModule,
    // StayInformedModule,
    // ThankYouModule,
    // TwitterTimelineWidgetModule, // ?
    WarningMessageModule,
    DdpUserMenuModule
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
    AnalyticsManagementService,
  ],
  declarations: [
    AppComponent,
    AppRedesignedBaseComponent,
    LazyWidgetComponent
  ],
  exports: [
    AppComponent,
    AppRedesignedBaseComponent,
    LazyWidgetComponent
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
