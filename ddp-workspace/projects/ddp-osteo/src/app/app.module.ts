import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import {
    DdpModule,
    ConfigurationService,
    AnalyticsEventsService,
    AnalyticsEvent,
    LoggingService,
    SubmitAnnouncementService,
    SubmissionManager,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { WelcomeComponent } from './components/welcome/welcome.component';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { FaqComponent } from './components/faq/faq.component';
import { HeaderComponent } from './components/header/header.component';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress.component';

import { ParticipationComponent } from './components/participation/participation.component';
import { ScientificImpactComponent } from './components/scientific-impact/scientific-impact.component';
import { PhysiciansComponent } from './components/physicians/physicians.component';

import { ActivityComponent } from './components/activity/activity.component';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserActivitiesComponent } from './components/user-activities/user-activities.component';
import { MatTableModule } from '@angular/material/table';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { WorkflowStartComponent } from './components/workflow-start/workflow-start.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PrequalifierService } from './services/prequalifier.service';
import { GovernedUserService } from './services/governed-user.service';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
    base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.aboutYouGuid = 'ABOUTYOU';
tkCfg.aboutChildGuid = 'ABOUTCHILD';
tkCfg.consentGuid = 'CONSENT';
tkCfg.consentAssentGuid = 'CONSENT_ASSENT';
tkCfg.parentalConsentGuid = 'PARENTAL_CONSENT';
tkCfg.releaseGuid = 'RELEASE_SELF';
tkCfg.releaseMinorGuid = 'RELEASE_MINOR';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.lovedOneGuid = 'LOVEDONE';
tkCfg.lovedOneThankYouGuid = 'THANK_YOU';
tkCfg.aboutYouUrl = 'about-you';
tkCfg.aboutChildUrl = 'about-your-child';
tkCfg.lovedOneUrl = 'loved-one';
tkCfg.consentUrl = 'consent';
tkCfg.consentAssentUrl = 'consent-assent';
tkCfg.parentalConsentUrl = 'parental-consent';
tkCfg.releaseMinorUrl = 'release-minor-survey';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.doneUrl = 'proxy-thank-you';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.stayInformedUrl = 'stay-informed';
tkCfg.lovedOneThankYouUrl = 'loved-one-thank-you';
tkCfg.familyHistoryThankYouUrl = 'family-history-thank-you';
tkCfg.mailingListDialogUrl = 'updates';
tkCfg.phone = '651-602-2020';
tkCfg.infoEmail = 'info@osproject.org';
tkCfg.twitterAccountId = 'count_me_in';
tkCfg.facebookGroupId = 'joincountmein';
tkCfg.instagramId = 'countmein';
tkCfg.useMultiParticipantDashboard = true;
// to configure feed, go to: https://lightwidget.com/widget-info/814feee04df55de38ec37791efea075e
// need Instagram credentials for @osteosarcomaproject
tkCfg.lightswitchInstagramWidgetId = '006168756c7f5d4a8a831488c63ea48c';
tkCfg.countMeInUrl = 'https://joincountmein.org/';

export const config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = DDP_ENV.studyGuid;
config.logLevel = DDP_ENV.logLevel;
config.baseUrl = location.origin + base;
config.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
config.loginLandingUrl = DDP_ENV.loginLandingUrl;
config.auth0CodeRedirect = location.origin + base + 'auth';
config.localRegistrationUrl = config.backendUrl + '/pepper/v1/register';
config.doLocalRegistration = DDP_ENV.doLocalRegistration;
config.mapsApiKey = DDP_ENV.mapsApiKey;
config.auth0Audience = DDP_ENV.auth0Audience;
config.projectGAToken = DDP_ENV.projectGAToken;
config.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
config.projectGcpId = DDP_ENV.projectGcpId;
config.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
config.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
config.dashboardActivitiesStartedStatuses = ['CREATED'];
config.dashboardActivitiesCompletedStatuses = ['COMPLETE'];
config.doCloudLogging = DDP_ENV.doCloudLogging;
config.tooltipIconUrl = 'assets/images/info.png';
config.usesVerticalStepper = [
    'FAMILY_HISTORY',
    'FAMILY_HISTORY_SELF',
    'FAMILY_HISTORY_PARENTAL',
];
config.alwaysShowQuestionsCountInModalNestedActivity = true;
config.validateOnlyVisibleSections = true;
config.institutionsAdditionalFields = { PHYSICIAN: ['COUNTRY'] };

export function translateFactory(
    translate: TranslateService,
    injector: Injector,
    logger: LoggingService
): () => Promise<any> {
    return () =>
        new Promise<any>((resolve: any) => {
            const LOG_SOURCE = 'AppModule';
            const locationInitialized = injector.get(
                LOCATION_INITIALIZED,
                Promise.resolve(null)
            );
            locationInitialized.then(() => {
                const locale = 'en';
                translate.setDefaultLang(locale);
                translate.use(locale).subscribe({
                    next: () => {
                        logger.logEvent(
                            LOG_SOURCE,
                            `Successfully initialized '${locale}' language as default.`
                        );
                    },
                    error: (err) => {
                        logger.logError(
                            LOG_SOURCE,
                            `Problem with '${locale}' language initialization:`,
                            err
                        );
                    },
                    complete: () => {
                        resolve(null);
                    },
                });
            });
        });
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        AppRoutingModule,
        DdpModule,
        ToolkitModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        HammerModule,
        MatTableModule,
    ],
    declarations: [
        WelcomeComponent,
        AppComponent,
        FooterComponent,
        GalleryComponent,
        AboutUsComponent,
        FaqComponent,
        ScientificImpactComponent,
        HeaderComponent,
        WorkflowProgressComponent,
        ParticipationComponent,
        PhysiciansComponent,
        ActivityComponent,
        ActivityPageComponent,
        DashboardComponent,
        UserActivitiesComponent,
        FaqSectionComponent,
        WorkflowStartComponent,
        LandingPageComponent,
    ],
    providers: [
        {
            provide: 'ddp.config',
            useValue: config,
        },
        {
            provide: 'toolkit.toolkitConfig',
            useValue: tkCfg,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: translateFactory,
            deps: [TranslateService, Injector, LoggingService],
            multi: true,
        },
        SubmitAnnouncementService,
        SubmissionManager,
        PrequalifierService,
        GovernedUserService,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private analytics: AnalyticsEventsService) {
        this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
            ga('send', event);
            ga('platform.send', event);
        });
    }
}
