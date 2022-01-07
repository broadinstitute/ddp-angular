import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule, ViewportScroller } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { Router, Scroll, Event } from '@angular/router';
import { filter, delay } from 'rxjs/operators';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { RECAPTCHA_LANGUAGE, RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './activity-guids';

import {
    DdpModule,
    ConfigurationService,
    AnalyticsEventsService,
    AnalyticsEvent,
    QuestionType,
    LoggingService,
    LanguageService,
    UserActivityServiceAgent
} from 'ddp-sdk';

import {
    ToolkitModule,
    ToolkitConfigurationService
} from 'toolkit';

import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MailingListComponent } from './components/mailing-list/mailing-list.component';
import { UserRegistrationPrequalComponent } from './components/user-registration-prequal/user-registration-prequal.component';
import { PrismComponent } from './components/prism/prism.component';
import { PrismActivityLinkComponent } from './components/prism-activity-link/prism-activity-link.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { HelpComponent } from './components/help/help.component';
import { ResultsDashboardComponent } from './components/results-dashboard/results-dashboard.component';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppUserActivityServiceAgent } from './services/userActivityServiceAgent.service';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
    base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.addressUrl = AppRoutes.Address;
toolkitConfig.consentUrl = AppRoutes.Consent;
toolkitConfig.covidSurveyUrl = AppRoutes.CovidSurvey;
toolkitConfig.symptomSurveyUrl = AppRoutes.SymptomSurvey;
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.adminDashboardUrl = AppRoutes.Prism;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.errorUrl = AppRoutes.Error;
toolkitConfig.addressGuid = ActivityGuids.Address;
toolkitConfig.consentGuid = ActivityGuids.Consent;
toolkitConfig.covidSurveyGuid = ActivityGuids.Covid;
toolkitConfig.symptomSurveyGuid = ActivityGuids.Symptom;
toolkitConfig.dashboardGuid = ActivityGuids.Dashboard;
toolkitConfig.phone = '617-525-4220';
toolkitConfig.infoEmail = 'info@testboston.org';
toolkitConfig.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;
toolkitConfig.agreeConsent = true;
toolkitConfig.dashboardDisplayedColumns = ['name', 'status', 'actions'];

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
sdkConfig.supportedCountry = 'US';
sdkConfig.dashboardShowQuestionCount = true;
sdkConfig.dashboardShowQuestionCountExceptions = ['CONSENT', 'ADHOC_SYMPTOM', 'RESULT_REPORT'];
sdkConfig.dashboardActivitiesCompletedStatuses = ['COMPLETE'];
sdkConfig.dashboardActivitiesStartedStatuses = ['CREATED'];
sdkConfig.dashboardSummaryInsteadOfStatus = ['ADHOC_SYMPTOM', 'RESULT_REPORT'];
sdkConfig.dashboardReportActivities = ['RESULT_REPORT'];
sdkConfig.tooltipIconUrl = 'assets/images/info.png';
sdkConfig.lookupPageUrl = AppRoutes.Prism;
sdkConfig.compositeRequiredFieldExceptions = [QuestionType.Numeric];
sdkConfig.addressEnforceRequiredFields = true;
sdkConfig.scrollToErrorOffset = 130;
sdkConfig.defaultLanguageCode = 'en';
sdkConfig.rtlLanguages = ['ar'];
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
sdkConfig.doCloudLogging = DDP_ENV.doCloudLogging;
sdkConfig.useStepsWithCircle = true;

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

export function languageFactory(language: LanguageService): string {
    return language.getAppLanguageCode();
}

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        HeaderComponent,
        WelcomeComponent,
        MailingListComponent,
        UserRegistrationPrequalComponent,
        PrismComponent,
        ResultsDashboardComponent,
        PrismActivityLinkComponent,
        EnrollmentComponent,
        HelpComponent
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
        MatRadioModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        ReactiveFormsModule,
        MatTooltipModule,
        FormsModule
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
        {
            provide: RECAPTCHA_LANGUAGE,
            useFactory: languageFactory,
            deps: [
                LanguageService
            ]
        },
        {
            provide: UserActivityServiceAgent,
            useClass: AppUserActivityServiceAgent
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(
        private analytics: AnalyticsEventsService,
        private router: Router,
        private viewportScroller: ViewportScroller) {
        this.initGoogleAnalyticsListener();
        this.initScrollRestorationListener();
    }

    private initGoogleAnalyticsListener(): void {
        this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
            ga('send', event);
            ga('platform.send', event);
        });
    }

    private initScrollRestorationListener(): void {
        this.router.events.pipe(
            filter((event: Event): event is Scroll => event instanceof Scroll),
            delay(0)
        ).subscribe(e => {
            if (e.position) {
                // backward navigation
                this.viewportScroller.scrollToPosition(e.position);
            } else if (e.anchor) {
                // anchor navigation
                const anchor = document.getElementById(e.anchor);
                if (anchor) {
                    anchor.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else {
                // forward navigation
                this.viewportScroller.scrollToPosition([0, 0]);
            }
        });
    }
}
