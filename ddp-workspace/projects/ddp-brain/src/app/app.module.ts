import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './aсtivity-guids';

import {
    DdpModule,
    ConfigurationService,
    AnalyticsEventsService,
    AnalyticsEvent,
    LoggingService
} from 'ddp-sdk';

import {
    ToolkitModule,
    ToolkitConfigurationService
} from 'toolkit';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FaqComponent } from './components/faq/faq.component';
import { DataComponent } from './components/data/data.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LearnMoreSectionComponent } from './components/learn-more-section/learn-more-section.component';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ModalImageComponent } from './components/modal-image/modal-image.component';
import { PrismComponent } from './components/prism/prism.component';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
    base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.aboutYouGuid = ActivityGuids.AboutYou;
toolkitConfig.consentGuid = ActivityGuids.Consent;
toolkitConfig.releaseGuid = ActivityGuids.Release;
toolkitConfig.dashboardGuid = ActivityGuids.Dashboard;
toolkitConfig.adminDashboardUrl = AppRoutes.Prism;
toolkitConfig.aboutYouUrl = AppRoutes.AboutYou;
toolkitConfig.consentUrl = AppRoutes.Consent;
toolkitConfig.releaseUrl = AppRoutes.Release;
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.errorUrl = AppRoutes.Error;
toolkitConfig.stayInformedUrl = AppRoutes.StayInformed;
toolkitConfig.mailingListDialogUrl = AppRoutes.MailingList;
toolkitConfig.phone = '651-229-3480';
toolkitConfig.infoEmail = 'info@braintumorproject.org';
toolkitConfig.dataEmail = 'data@braintumorproject.org';
toolkitConfig.twitterAccountId = 'count_me_in';
toolkitConfig.facebookGroupId = 'joincountmein';
toolkitConfig.instagramId = 'countmein';
toolkitConfig.countMeInUrl = 'https://joincountmein.org/';

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
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl;
sdkConfig.doCloudLogging = DDP_ENV.doCloudLogging;
sdkConfig.prismColumns = [
    'guid', 'shortId', 'userName', 'email',
    'enrollmentStatus', 'dashboardLink', 'invitationId',
    'proxyGuid', 'proxyShortId', 'proxyUserName'
];
sdkConfig.prismDashboardRoute = AppRoutes.Dashboard;
sdkConfig.lookupPageUrl = AppRoutes.Prism;
sdkConfig.prismRoute = AppRoutes.Prism;

export function translateFactory(translate: TranslateService, injector: Injector, logger: LoggingService): () => Promise<any> {
    return () => new Promise<any>((resolve: any) => {
        const LOG_SOURCE = 'AppModule';
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const locale = 'en';
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
        WelcomeComponent,
        HeaderComponent,
        FooterComponent,
        FaqComponent,
        DataComponent,
        AboutUsComponent,
        ModalImageComponent,
        LearnMoreSectionComponent,
        PrismComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        DdpModule,
        ToolkitModule,
        MatIconModule,
        MatExpansionModule,
        MatButtonModule
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
                LoggingService
            ],
            multi: true
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
