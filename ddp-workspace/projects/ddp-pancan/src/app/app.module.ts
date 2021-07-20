import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import { TranslateService } from '@ngx-translate/core';

import {
    DdpModule,
    ConfigurationService,
    LoggingService,
    LanguageService
} from 'ddp-sdk';

import {
    ToolkitModule,
    ToolkitConfigurationService
} from 'toolkit';

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
import { AnchorsPageComponent } from './components/anchors-page/anchors-page.component';
import { ScientificResearchComponent } from './components/scientific-research/scientific-research.component';

const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;

declare const ga: (...args: any[]) => void;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.errorUrl = AppRoutes.Error;
toolkitConfig.phone = '651-287-1608';
toolkitConfig.infoEmail = 'info@joincountmein.org';
toolkitConfig.useParticipantDashboard = true;
toolkitConfig.dashboardDisplayedColumns = ['name', 'summary', 'status', 'actions'];

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
        AnchorsPageComponent,
        ScientificResearchComponent,
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
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
