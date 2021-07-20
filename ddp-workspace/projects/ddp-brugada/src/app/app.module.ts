import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import {
  DdpModule,
  ConfigurationService,
  LoggingService,
  LanguageService,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { AppComponent } from './components/app/app.component';
import { HeaderComponent } from './components/header/header.component';
import { AboutComponent } from './pages/about/about.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { TeamComponent } from './pages/team/team.component';
import { AppRoutingModule } from './app-routing.module';

const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;

export const sdkConfig = new ConfigurationService();
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.logLevel = DDP_ENV.logLevel;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.defaultLanguageCode = 'en';
sdkConfig.baseUrl = location.origin + base;
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';

export function translateFactory(
  translate: TranslateService,
  injector: Injector,
  logger: LoggingService,
  language: LanguageService,
): () => Promise<any> {
  return () =>
    new Promise<any>((resolve: any) => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      );

      locationInitialized.then(() => {
        const locale = language.getAppLanguageCode();

        translate.setDefaultLang(locale);

        translate.use(locale).subscribe(
          () => {
            logger.logEvent(
              LOG_SOURCE,
              `Successfully initialized '${locale}' language as default.`,
            );
          },
          err => {
            logger.logError(
              LOG_SOURCE,
              `Problem with '${locale}' language initialization:`,
              err,
            );
          },
          () => {
            resolve(null);
          },
        );
      });
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    FaqComponent,
    HomeComponent,
    TeamComponent,
  ],
  imports: [BrowserModule, DdpModule, ToolkitModule, AppRoutingModule],
  providers: [
    {
      provide: 'ddp.config',
      useValue: sdkConfig,
    },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: toolkitConfig,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [TranslateService, Injector, LoggingService, LanguageService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
