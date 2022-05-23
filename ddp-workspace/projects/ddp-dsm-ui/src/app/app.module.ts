import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ConfigurationService, DdpModule} from 'ddp-sdk';
import {StackdriverErrorReporterDsmService} from './services/stackdriver-error-reporter.service';
import {CheckAuthGuard} from './guards/checkAuth.guard';
import {StudyGuard} from './guards/study.guard';


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


const guards = [StudyGuard, CheckAuthGuard];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DdpModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    ...guards,
    {provide: ErrorHandler, useClass: StackdriverErrorReporterDsmService},
    {
      provide: 'ddp.config',
      useValue: sdkConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
