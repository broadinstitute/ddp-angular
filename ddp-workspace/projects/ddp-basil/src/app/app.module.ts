import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { RECAPTCHA_LANGUAGE, RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { TranslateService } from '@ngx-translate/core';

import {
    DdpModule,
    ConfigurationService,
    AnalyticsEventsService,
    AnalyticsEvent,
    LoggingService,
    LanguageService
} from 'ddp-sdk';

import {
    ToolkitModule,
    ToolkitConfigurationService
} from 'toolkit';

import { AppRoutes } from './app-routes';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { PrismActivityLinkComponent } from './components/prism-activity-link/prism-activity-link.component';
import { PrismComponent } from './components/prism/prism.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;
declare const ga: (...args: any[]) => void;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.phone = '111-222-3333';
toolkitConfig.infoEmail = 'basil@datadonationplatform.org';
toolkitConfig.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;
toolkitConfig.adminDashboardUrl = AppRoutes.Prism;
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.errorUrl = AppRoutes.Error;

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
sdkConfig.auth0CodeRedirect = location.origin + base + AppRoutes.LocalAuth;
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
sdkConfig.doCloudLogging = DDP_ENV.doGcpErrorReporting;
sdkConfig.dashboardShowQuestionCount = true;
sdkConfig.dashboardShowQuestionCountExceptions = ['CONSENT'];
sdkConfig.prismColumns = ['guid', 'shortId', 'userName', 'email', 'enrollmentStatus', 'dashboardLink'];
sdkConfig.prismDashboardRoute = AppRoutes.Dashboard;
sdkConfig.prismRoute = AppRoutes.Prism;
sdkConfig.lookupPageUrl = AppRoutes.Prism;

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
            translate.use(locale).subscribe(() => {
                logger.logEvent(LOG_SOURCE, `Successfully initialized '${locale}' language as default.`);
            }, err => {
                logger.logError(LOG_SOURCE, `Problem with '${locale}' language initialization:`, err);
            }, () => {
                resolve(null);
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
        HeaderComponent,
        PrismActivityLinkComponent,
        PrismComponent,
        WelcomeComponent,
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CommonModule,
        DdpModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        ToolkitModule
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
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

    constructor(private analytics: AnalyticsEventsService) {
        this.initGoogleAnalyticsListener();
    }

    private initGoogleAnalyticsListener(): void {
        this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
            ga('send', event);
            ga('platform.send', event);
        });
    }
}
