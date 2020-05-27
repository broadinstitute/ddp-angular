import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { LOCATION_INITIALIZED, CommonModule, ViewportScroller } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { Router, Scroll, Event } from '@angular/router';
import { filter, delay } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { AppRoutes } from './app-routes';
import { ActivityGuids } from './aсtivity-guids';

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
import { MailingListComponent } from './components/mailing-list/mailing-list.component';
import { UserRegistrationPrequalComponent } from './components/user-registration-prequal/user-registration-prequal.component';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

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
toolkitConfig.dashboardUrl = AppRoutes.Dashboard;
toolkitConfig.activityUrl = AppRoutes.Activity;
toolkitConfig.errorUrl = AppRoutes.Error;
toolkitConfig.addressGuid = ActivityGuids.Address;
toolkitConfig.consentGuid = ActivityGuids.Consent;
toolkitConfig.covidSurveyGuid = ActivityGuids.Covid;
toolkitConfig.dashboardGuid = ActivityGuids.Dashboard;
toolkitConfig.phone = '1-617-123-4567';
toolkitConfig.infoEmail = 'info@testboston.org';
toolkitConfig.recaptchaSiteKey = '6LdxFPsUAAAAAFdX1VHmLIbxAD8f151Kg0wk9KwJ';
toolkitConfig.agreeConsent = true;

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

export function translateFactory(translate: TranslateService, injector: Injector): any {
    return () => new Promise<any>((resolve: any) => {
        const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
        locationInitialized.then(() => {
            const locale = 'en';
            translate.setDefaultLang(locale);
            translate.use(locale).subscribe(() => {
                console.log(`Successfully initialized '${locale}' language as default.`);
            }, () => {
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
        MailingListComponent,
        UserRegistrationPrequalComponent
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
        MatTooltipModule
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
