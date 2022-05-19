import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, ErrorHandler, Injector, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ConfigurationService, DdpModule, LanguageService, LoggingService} from 'ddp-sdk';
import {StackdriverErrorReporterDsmService} from './services/stackdriver-error-reporter.service';
import {CheckAuthGuard} from './guards/checkAuth.guard';
import {StudyGuard} from './guards/study.guard';
import {NavigationComponent} from './FON/layout/navigation/navigation.component';
import {HomeComponent} from './FON/pages/home/home.component';
import {ParticipantsListComponent} from './FON/pages/participantsList/participantsList.component';
import {ActivitiesComponent} from './FON/pages/activities/activities.component';
import {FonComponent} from './FON/fon.component';
import {ActivityComponent} from './FON/pages/activities/activity/activity.component';
import {StudyActGuard} from './guards/studyAct.guard';
import {AgentService} from './FON/services/agent.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslateService} from '@ngx-translate/core';
import {LOCATION_INITIALIZED} from '@angular/common';

const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;

export const sdkConfig = new ConfigurationService();
sdkConfig.backendUrl = 'https://pepper-dev.datadonationplatform.org'; // TODO: move the value below to DDP_ENV as an DSS API URL(main DSM config file), depending on environment
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientKey;
sdkConfig.adminClientId = DDP_ENV.adminClientId || DDP_ENV.auth0ClientKey;
sdkConfig.studyGuid = DDP_ENV.serviceName;
sdkConfig.logLevel = DDP_ENV.logLevel || 1;
sdkConfig.baseUrl = location.origin + base;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.cloudLoggingUrl = DDP_ENV.cloudLoggingUrl; // TODO: add the URL value in config file
sdkConfig.doCloudLogging = DDP_ENV.doGcpErrorReporting;
sdkConfig.auth0ClaimNameSpace = DDP_ENV.auth0ClaimNameSpace;
sdkConfig.errorPageUrl = 'dss-error';



export function translateFactory(translate: TranslateService,
                                 injector: Injector,
                                 logger: LoggingService,
                                 // language: LanguageService // TODO: setup languages for DSM
): () => Promise<any> {
  return () => new Promise<any>((resolve: any) => {
    const LOG_SOURCE = 'DSM AppModule';
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const locale = 'en'; // language.getAppLanguageCode();
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

// FON
const guards = [StudyGuard, CheckAuthGuard, StudyActGuard];
const material = [
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule
];

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    FonComponent,
    HomeComponent,
    ActivityComponent,
    ParticipantsListComponent,
    ActivitiesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DdpModule,
    HttpClientModule,
    AppRoutingModule,
    ...material
  ],
  providers: [
    ...guards,
    AgentService,
    {provide: ErrorHandler, useClass: StackdriverErrorReporterDsmService},
    {
      provide: 'ddp.config',
      useValue: sdkConfig
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
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
