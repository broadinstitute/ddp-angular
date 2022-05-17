import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import {
    DdpModule,
    ConfigurationService,
    AnalyticsEventsService,
    AnalyticsEvent,
    LoggingService
} from 'ddp-sdk';

import {
    ToolkitModule,
    ToolkitConfigurationService,
    AppComponent
} from 'toolkit';

import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { PrismComponent } from './components/prism/prism.component';
import { WelcomeComponent } from './components/welcome/welcome.component';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
    base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.aboutYouGuid = 'ANGIOABOUTYOU';
tkCfg.consentGuid = 'ANGIOCONSENT';
tkCfg.releaseGuid = 'ANGIORELEASE';
tkCfg.lovedOneGuid = 'ANGIOLOVEDONE';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.lovedOneThankYouGuid = 'THANK_YOU';
tkCfg.aboutYouUrl = 'about-you';
tkCfg.lovedOneUrl = 'loved-one';
tkCfg.consentUrl = 'consent';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.adminDashboardUrl = 'prism';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.stayInformedUrl = 'stay-informed';
tkCfg.lovedOneThankYouUrl = 'loved-one-thank-you';
tkCfg.internationalPatientsUrl = 'international-patients';
tkCfg.moreDetailsUrl = 'more-details';
tkCfg.mailingListDialogUrl = 'updates';
tkCfg.phone = '857-500-6264';
tkCfg.infoEmail = 'info@ascproject.org';
tkCfg.dataEmail = 'data@ascproject.org';
tkCfg.twitterAccountId = 'https://twitter.com/count_me_in';
tkCfg.facebookGroupId = 'https://www.facebook.com/joincountmein';
tkCfg.cBioPortalLink = 'https://www.cbioportal.org/study/summary?id=angs_painter_2020';
tkCfg.countMeInUrl = 'https://joincountmein.org/';
tkCfg.showDataRelease = true;
tkCfg.showInfoForPhysicians = true;
tkCfg.showBlog = false;
tkCfg.blogUrl = '';

export const config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.adminClientId = DDP_ENV.adminClientId;
config.studyGuid = DDP_ENV.studyGuid;
config.logLevel = DDP_ENV.logLevel;
config.baseUrl = location.origin + base;
config.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
config.loginLandingUrl = DDP_ENV.loginLandingUrl;
config.adminLoginLandingUrl = DDP_ENV.adminLoginLandingUrl;
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
config.doCloudLogging = DDP_ENV.doCloudLogging;
config.prismColumns = ['guid', 'shortId', 'userName', 'email', 'enrollmentStatus', 'dashboardLink', 'legacyShortId', 'legacyAltPid'];
config.prismDashboardRoute = 'dashboard';
config.prismRoute = 'prism';
config.lookupPageUrl = config.prismRoute;

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
                    logger.logError(LOG_SOURCE, `Problem with '${locale}' language initialization`, err);
                },
                complete: () => {
                    resolve(null);
                }
            });
        });
    });
}

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        DdpModule,
        ToolkitModule
    ],
    declarations: [
        AboutUsComponent,
        DataReleaseComponent,
        MoreDetailsComponent,
        PrismComponent,
        WelcomeComponent,
    ],
    providers: [
        {
            provide: 'ddp.config',
            useValue: config
        },
        {
            provide: 'toolkit.toolkitConfig',
            useValue: tkCfg
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
