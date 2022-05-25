import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import {
    ConfigurationService,
    DdpModule,
    LanguageService,
    LoggingService,
    SortOrder,
    AnalyticsEventsService,
    AnalyticsEvent,
    PICKLIST_SORTING_POLICY_LAST_STABLE_ID,
    PICKLIST_SORTING_POLICY_MAIN_SORT_ORDER
} from 'ddp-sdk';

import { ToolkitConfigurationService, ToolkitModule } from 'toolkit';

import { AppRoutes } from './components/app-routes';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { FaqSectionComponent } from './components/faq-section/faq-section.component';
import { FaqComponent } from './components/faq/faq.component';
import { ParticipationComponent } from './components/participation/participation.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { AuthComponent } from './components/auth/auth.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { PageWithSectionsComponent } from './components/page-with-sections/page-with-sections.component';
import { ScientificResearchComponent } from './components/scientific-research/scientific-research.component';
import { ParticipationSectionComponent } from './components/welcome/participation-section/participation-section.component';
import { StayInformedSectionComponent } from './components/welcome/stay-informed-section/stay-informed-section.component';
import { JoinCmiSectionComponent } from './components/welcome/join-cmi-section/join-cmi-section.component';
import { ColorectalPageComponent } from './components/splash-pages/colorectal-page/colorectal-page.component';
import { SplashPageFooterComponent } from './components/splash-pages/splash-page-footer/splash-page-footer.component';
import { LmsPageComponent } from './components/splash-pages/lms-page/lms-page.component';
import { ActivityComponent } from './components/activity/activity.component';
import { ActivityPageComponent } from './components/activity-page/activity-page.component';

const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.doneUrl = AppRoutes.AgeUpThankYouProxy;
toolkitConfig.errorUrl = AppRoutes.Error;
toolkitConfig.phone = '651-403-5315';
toolkitConfig.infoEmail = 'info@joincountmein.org';
toolkitConfig.twitterAccountId = 'count_me_in';
toolkitConfig.facebookGroupId = 'joincountmein';
toolkitConfig.instagramId = 'countmein';
toolkitConfig.countMeInUrl = 'https://joincountmein.org';
toolkitConfig.colorectalPagePhone = '651-403-5315';
toolkitConfig.colorectalPageEmail = 'info@colorectalcancerproject.org';
toolkitConfig.lmsPagePhone = '';  // TODO: add real phone
toolkitConfig.lmsPageEmail = 'info@lmsproject.org';
toolkitConfig.lmsStudyGuid = 'cmi-lms';
toolkitConfig.useMultiParticipantDashboard = true;
toolkitConfig.dashboardDisplayedColumns = ['name', 'summary', 'status', 'actions'];
toolkitConfig.allowEditUserProfile = true;

export const sdkConfig = new ConfigurationService();
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.adminClientId = DDP_ENV.adminClientId;
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.logLevel = DDP_ENV.logLevel;
sdkConfig.baseUrl = location.origin + base;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.adminLoginLandingUrl = DDP_ENV.adminLoginLandingUrl;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.doCloudLogging = DDP_ENV.doCloudLogging;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
sdkConfig.tooltipIconUrl = 'assets/images/info.png';
sdkConfig.useStepsWithCircle = true;
sdkConfig.notSortedPicklistAutocompleteStableIds = ['PRIMARY_CANCER_SELF', 'PRIMARY_CANCER_CHILD'];
sdkConfig.usesVerticalStepper = [
    'FAMILY_HISTORY',
    'FAMILY_HISTORY_PARENT',
    'FAMILY_HISTORY_PARENT_SIBLING',
    'FAMILY_HISTORY_GRANDPARENT',
    'FAMILY_HISTORY_SIBLING',
    'FAMILY_HISTORY_CHILD',
    'FAMILY_HISTORY_ADDITIONAL_DETAILS',
    'DIET_LIFESTYLE',
];
sdkConfig.alwaysShowQuestionsCountInModalNestedActivity = true;

export function translateFactory(translate: TranslateService,
    injector: Injector,
    logger: LoggingService,
    language: LanguageService): () => Promise<any> {
    return () => new Promise<any>((resolve: any) => {
        const LOG_SOURCE = 'AppModule';
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const locale = language.getAppLanguageCode();
            translate.setDefaultLang(locale);
            translate.use(locale).subscribe({
                next: () => {
                    logger.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
                },
                error: err => {
                    logger.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
                },
                complete: () => {
                    resolve(null);
                }
            });
        });
    });
}

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        WelcomeComponent,
        FaqSectionComponent,
        FaqComponent,
        ParticipationComponent,
        NavigationComponent,
        AuthComponent,
        AboutUsComponent,
        PageWithSectionsComponent,
        ScientificResearchComponent,
        ParticipationSectionComponent,
        StayInformedSectionComponent,
        JoinCmiSectionComponent,
        ColorectalPageComponent,
        SplashPageFooterComponent,
        LmsPageComponent,
        ActivityComponent,
        ActivityPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        DdpModule,
        ToolkitModule,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: 'ddp.config',
            useValue: sdkConfig
        },
        {
            provide: 'toolkit.toolkitConfig',
            useValue: toolkitConfig
        },
        {
            provide: APP_INITIALIZER,
            useFactory: translateFactory,
            deps: [
                TranslateService,
                Injector,
                LoggingService,
                LanguageService
            ],
            multi: true
        },
        // Ensure that sorting of autocomplete picklist options is as specified
        {
            provide: PICKLIST_SORTING_POLICY_MAIN_SORT_ORDER,
            useValue: SortOrder.ALPHABETICAL
        },
        {
            provide: PICKLIST_SORTING_POLICY_LAST_STABLE_ID,
            useValue: 'UNSURE'
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private analytics: AnalyticsEventsService) {
        this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
            ga('send', event);
            ga('platform.send', event);
        });
    }
}
