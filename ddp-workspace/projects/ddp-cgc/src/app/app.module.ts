import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import {
  ConfigurationService,
  DdpModule,
  LanguageService,
  LoggingService,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LearnMoreComponent } from './components/pages/learn-more/learn-more.component';
import { translateFactory } from './util/translateFactory';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

declare const DDP_ENV: any;

const base = document.querySelector('base').getAttribute('href') || '';

/**
 * DDP SDK config
 */
export const ddpCfg = new ConfigurationService();
ddpCfg.studyGuid = DDP_ENV.studyGuid;
ddpCfg.backendUrl = DDP_ENV.basePepperUrl;
ddpCfg.auth0Domain = DDP_ENV.auth0Domain;
ddpCfg.auth0ClientId = DDP_ENV.auth0ClientId;
ddpCfg.baseUrl = location.origin + base;
ddpCfg.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
ddpCfg.loginLandingUrl = DDP_ENV.loginLandingUrl;
ddpCfg.auth0CodeRedirect = ddpCfg.baseUrl + 'auth';
ddpCfg.localRegistrationUrl = ddpCfg.backendUrl + '/pepper/v1/register';
ddpCfg.doLocalRegistration = DDP_ENV.doLocalRegistration;
ddpCfg.mapsApiKey = DDP_ENV.mapsApiKey;
ddpCfg.auth0Audience = DDP_ENV.auth0Audience;
ddpCfg.projectGAToken = DDP_ENV.projectGAToken;
ddpCfg.logLevel = DDP_ENV.logLevel;
ddpCfg.errorReportingApiKey = DDP_ENV.errorReportingApiKey;
ddpCfg.projectGcpId = DDP_ENV.projectGcpId;
ddpCfg.defaultLanguageCode = DDP_ENV.defaultLanguageCode || 'en';
ddpCfg.doGcpErrorReporting = DDP_ENV.doGcpErrorReporting;

/**
 * Toolkit config
 */
export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    LearnMoreComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, DdpModule, ToolkitModule],
  providers: [
    {
      provide: 'ddp.config',
      useValue: ddpCfg,
    },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: tkCfg,
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
