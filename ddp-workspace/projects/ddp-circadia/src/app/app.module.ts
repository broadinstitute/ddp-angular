import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

import {
  DdpModule,
  ConfigurationService,
  LoggingService,
  LanguageService,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { AppRoutingModule } from './app-routing.module';

declare const DDP_ENV: any;

const base = document.querySelector('base').getAttribute('href') || '';

export const sdkConfig = new ConfigurationService();
sdkConfig.studyGuid = DDP_ENV.studyGuid;
sdkConfig.backendUrl = DDP_ENV.basePepperUrl;
sdkConfig.auth0Domain = DDP_ENV.auth0Domain;
sdkConfig.auth0Audience = DDP_ENV.auth0Audience;
sdkConfig.auth0ClientId = DDP_ENV.auth0ClientId;
sdkConfig.logLevel = DDP_ENV.logLevel;
sdkConfig.baseUrl = location.origin + base;
sdkConfig.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
sdkConfig.loginLandingUrl = DDP_ENV.loginLandingUrl;
sdkConfig.auth0CodeRedirect = location.origin + base + 'auth';
sdkConfig.localRegistrationUrl = sdkConfig.backendUrl + '/pepper/v1/register';
sdkConfig.doLocalRegistration = DDP_ENV.doLocalRegistration;
sdkConfig.mapsApiKey = DDP_ENV.mapsApiKey;
sdkConfig.projectGAToken = DDP_ENV.projectGAToken;
sdkConfig.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;
sdkConfig.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
sdkConfig.projectGcpId = DDP_ENV.projectGcpId;
sdkConfig.defaultLanguageCode = 'en';

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;

export function translateFactory(
  inj: Injector,
  languageService: LanguageService,
  translateService: TranslateService,
  loggingService: LoggingService,
): () => Promise<any> {
  return () =>
    new Promise<any>(resolve => {
      const LOG_SOURCE = 'AppModule';
      const locationInitialized = inj.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      );

      locationInitialized.then(() => {
        const locale = languageService.getAppLanguageCode();

        translateService.setDefaultLang(locale);

        translateService.use(locale).subscribe(
          () => {
            loggingService.logEvent(
              LOG_SOURCE,
              `Successfully initialized '${locale}' language as default.`,
            );
          },
          err => {
            loggingService.logError(
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
  declarations: [AppComponent, FooterComponent, HeaderComponent, HomeComponent],
  imports: [
    BrowserModule,
    MatExpansionModule,
    MatIconModule,
    DdpModule,
    ToolkitModule,
    AppRoutingModule,
  ],
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
      deps: [Injector, LanguageService, TranslateService, LoggingService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
