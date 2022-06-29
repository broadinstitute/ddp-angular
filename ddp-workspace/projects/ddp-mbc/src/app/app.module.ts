import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LOCATION_INITIALIZED } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import { AnalyticsEvent, AnalyticsEventsService, DdpModule, LanguageService, LoggingService } from 'ddp-sdk';

import { AppComponent, ToolkitConfigurationService, ToolkitModule } from 'toolkit';

import { AboutUsComponent } from './components/about-us/about-us.component';
import { DataReleaseComponent } from './components/data-release/data-release.component';
import { MoreDetailsComponent } from './components/more-details/more-details.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PartnersComponent } from './components/partners/partners.component';
import { MbcConfigurationService } from './services/mbcConfiguration.service';
import { LanguageHostRedirector } from './services/languageHostRedirector.service';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
    base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = 'cmi-mbc';
tkCfg.aboutYouGuid = 'ABOUTYOU';
tkCfg.consentGuid = 'CONSENT';
tkCfg.releaseGuid = 'RELEASE';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.tissueConsentGuid = 'TISSUECONSENT';
tkCfg.tissueReleaseGuid = 'TISSUERELEASE';
tkCfg.bloodConsentGuid = 'BLOODCONSENT';
tkCfg.bloodReleaseGuid = 'BLOODRELEASE';
tkCfg.followupGuid = 'FOLLOWUP';
tkCfg.aboutYouUrl = 'about-you';
tkCfg.consentUrl = 'consent';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.stayInformedUrl = 'stay-informed';
tkCfg.moreDetailsUrl = 'more-details';
tkCfg.tissueConsentUrl = 'tissue-consent';
tkCfg.tissueReleaseUrl = 'tissue-release';
tkCfg.bloodConsentUrl = 'blood-consent';
tkCfg.bloodReleaseUrl = 'blood-release-survey';
tkCfg.followupUrl = 'followup';
tkCfg.internationalPatientsUrl = 'international-patients';
tkCfg.mailingListDialogUrl = 'updates';
tkCfg.phone = '617-800-1622';
tkCfg.infoEmail = 'info@mbcproject.org';
tkCfg.dataEmail = 'data@mbcproject.org';
tkCfg.twitterAccountId = 'count_me_in';
tkCfg.facebookGroupId = 'joincountmein';
tkCfg.instagramId = 'countmein';
tkCfg.cBioPortalLink = 'http://www.cbioportal.org/study?id=brca_mbcproject_wagle_2017#summary';
tkCfg.countMeInUrl = 'https://joincountmein.org/';
tkCfg.showDataRelease = true;
tkCfg.showInfoForPhysicians = false;
tkCfg.showBlog = false;
tkCfg.blogUrl = 'http://mbc-project.blogspot.com/';

export const config = new MbcConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = tkCfg.studyGuid;
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
config.doCloudLogging = DDP_ENV.doCloudLogging;
config.baseHostName = DDP_ENV.baseHostName;
config.languageHostNames = DDP_ENV.languageHostNames || [];

function appInitializerFactory(translate: TranslateService, injector: Injector, logger: LoggingService,
                               language: LanguageService,
                               _redirector: LanguageHostRedirector): () => Promise<any> {
     return translateFactory(translate, injector, logger, language);

}

function translateFactory(translate: TranslateService,
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
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        DdpModule,
        ToolkitModule
    ],
    declarations: [
        AboutUsComponent,
        DataReleaseComponent,
        MoreDetailsComponent,
        WelcomeComponent,
        PartnersComponent
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
            useFactory: appInitializerFactory,
            deps: [
                TranslateService,
                Injector,
                LoggingService,
                LanguageService,
                LanguageHostRedirector,
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
