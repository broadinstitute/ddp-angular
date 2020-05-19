import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';

import { TranslateService } from '@ngx-translate/core';

import { AppRoutes } from './app-routes';
import { AppGuids } from './app-guids';

import {
    DdpModule,
    LogLevel,
    ConfigurationService,
    AnalyticsEventsService,
    AnalyticsEvent
} from 'ddp-sdk';

import {
    ToolkitModule,
    ToolkitConfigurationService
} from 'toolkit';

import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { UserRegistrationPrequalComponent } from './components/user-registration-prequal/user-registration-prequal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { RecaptchaFormsModule, RecaptchaModule, RecaptchaV3Module } from 'ng-recaptcha';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
    base = baseElt[0].getAttribute('href');
}

declare const DDP_ENV: any;

declare const ga: Function;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.consentUrl = AppRoutes.Consent;
toolkitConfig.covidSurveyUrl = AppRoutes.CovidSurvey;
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.errorUrl = AppRoutes.Error;
toolkitConfig.consentGuid = AppGuids.Consent;
toolkitConfig.covidSurveyGuid = AppGuids.Covid;
toolkitConfig.dashboardGuid = AppGuids.Dashboard;
toolkitConfig.phone = 'XXX-XXX-XXXX';
toolkitConfig.infoEmail = 'testboston@datadonationplatform.org';
toolkitConfig.recaptchaSiteKey = '6LdqYvUUAAAAAFl_KZFyNQBT3dMjvVnTb-P9wfAs';

export const sdkConfig = new ConfigurationService();
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.logLevel = LogLevel.Info;
sdkConfig.baseUrl = location.origin + base;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;

export function translateFactory(translate: TranslateService, injector: Injector) {
    return () => new Promise<any>((resolve: any) => {
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const locale = 'en';
            translate.setDefaultLang(locale);
            translate.use(locale).subscribe(() => {
                console.log(`Successfully initialized '${locale}' language as default.`);
            }, err => {
                console.error(`Problem with '${locale}' language initialization.`);
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
        UserRegistrationPrequalComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        DdpModule,
        ToolkitModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        RecaptchaModule,
        RecaptchaFormsModule,
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
                Injector
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
