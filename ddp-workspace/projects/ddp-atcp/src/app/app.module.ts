import { CommonModule, LOCATION_INITIALIZED } from '@angular/common';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import {
  AnalyticsEvent, AnalyticsEventsService, ConfigurationService, DdpModule
} from 'ddp-sdk';
import { CommunicationService, ToolkitConfigurationService, ToolkitModule } from 'toolkit';
import { AppRoutingModule } from './app-routing.module';
import { AboutInitiativeComponent } from './components/about-initiative/about-initiative';
import { AboutUsComponent } from './components/about-us/about-us';
import { AccountActivatedComponent } from './components/account-activation/accountActivated';
import { AccountActivationRequiredComponent } from './components/account-activation/accountActivationRequired';
import { AtcpActivityBaseComponent } from './components/activityForm/app-atcp-activity-base.component';
import { AtcpActivityComponent } from './components/activityForm/app-atcp-activity.component';
import { AppComponent } from './components/app/app.component';
import { ConsoleComponent } from './components/console/console';
import { DashBoardComponent } from './components/dashboard/dashboard';
import { DataAccessComponent } from './components/data-access/data-access';
import { FooterComponent } from './components/footer/footer';
import { HeaderComponent } from './components/header/header';
import { JoinUsComponent } from './components/join-us/join-us';
import { ExtractTranslationPathsForArrayPipe } from './components/Pipes/extractTranslationPathsForArrayPipe';
import { ProgressBarComponent } from './components/progress-bar/progress-bar';
import { StatisticsComponent } from './components/statistics/statistics';
import { WelcomeComponent } from './components/welcome/welcome';
import { WorkflowProgressComponent } from './components/workflow-progress/workflow-progress';
import { Language, LanguagesProvider, LanguagesToken } from './providers/languages.provider';
import * as RouterResource from './router-resources';
import { UserPreferencesServiceAgent } from './services/serviceAgents/userPreferencesServiceAgent';

// import of components prepared for SDK and Toolkit, but currently located in atcp project
import { FileUploaderComponent } from './sdk/components/file-uploader.component';
import { ActivityProgressBarComponent } from './sdk/components/activityProgressBar.component';
import { AtcpAuth0CodeCallbackComponent } from './sdk/login/atcp-auth0-code-callback.component';
import { ActivityProgressCalculationService } from './sdk/services/activityProgressCalculation.service';
import { CurrentActivityService } from './sdk/services/currentActivity.service';
import { PopupMessageComponent } from './toolkit/dialogs/popupMessage.component';
import { AtcpLoginLandingRedesignedComponent } from './toolkit/login/atcp-login-landing-redesigned.component';
import { AtcpLoginLandingComponent } from './toolkit/login/atcp-login-landing.component';
import { AtcpCommunicationService } from './toolkit/services/communication.service';

const baseElt = document.getElementsByTagName('base');

let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}

declare let DDP_ENV: any;
declare const ga: Function;
export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.dashboardUrl = RouterResource.Console;
tkCfg.errorUrl = RouterResource.Error;
tkCfg.infoEmail = 'support@atfamilies.org';
tkCfg.phone = '+1 954-481-6611';
export let config = new ConfigurationService();
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
config.defaultLanguageCode = DDP_ENV.defaultLanguageCode ? DDP_ENV.defaultLanguageCode : 'en';

export function translateFactory(translate: TranslateService, injector: Injector) {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    const languag: Language[] = injector.get(LanguagesToken, Promise.resolve(null));
    locationInitialized.then(() => {
      translate.addLangs(languag.map(x => x.code));
      const locale = config.defaultLanguageCode;
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
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    AppRoutingModule,
    DdpModule,
    ToolkitModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [
    WelcomeComponent,
    AppComponent,
    FooterComponent,
    AboutUsComponent,
    AboutInitiativeComponent,
    HeaderComponent,
    AtcpActivityBaseComponent,
    AtcpActivityComponent,
    JoinUsComponent,
    DataAccessComponent,
    DashBoardComponent,
    WorkflowProgressComponent,
    StatisticsComponent,
    ProgressBarComponent,
    ConsoleComponent,
    ExtractTranslationPathsForArrayPipe,
    AccountActivatedComponent,
    AccountActivationRequiredComponent,
    ActivityProgressBarComponent,
    AtcpAuth0CodeCallbackComponent,
    AtcpLoginLandingComponent,
    AtcpLoginLandingRedesignedComponent,
    FileUploaderComponent,
    PopupMessageComponent
  ],
  entryComponents: [
    DashBoardComponent,
    PopupMessageComponent
  ],
  providers: [
    CurrentActivityService,
    ActivityProgressCalculationService,
    CommunicationService,
    AtcpCommunicationService,
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
        Injector
      ],
      multi: true
    },
    LanguagesProvider,
    UserPreferencesServiceAgent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private analytics: AnalyticsEventsService) {
    this.analytics.analyticEvents.subscribe((event: AnalyticsEvent) => {
      ga('send', event);
      ga('platform.send', event);
    });
  }
}
