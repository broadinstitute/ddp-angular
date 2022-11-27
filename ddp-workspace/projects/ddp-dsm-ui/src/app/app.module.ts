import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {ConfigurationService} from 'ddp-sdk';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {CheckAuthGuard} from './guards/checkAuth.guard';
import {StudyGuard} from './guards/study.guard';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HttpInterceptorService} from "./interceptors/Http-interceptor.service";
import {ErrorSnackbarComponent} from "./Shared/components/error-snackbar/error-snackbar.component";
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {
  ErrorsHistorySnackbarComponent
} from "./Shared/components/errorsHistory-snackbar/errorsHistory-snackbar.component";
import {MatListModule} from '@angular/material/list';


const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;

export const sdkConfig = new ConfigurationService();

sdkConfig.backendUrl = 'https://pepper-dev.datadonationplatform.org';
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
sdkConfig.errorPageUrl = '';



// FON
const guards = [StudyGuard, CheckAuthGuard];


@NgModule({
  declarations: [
    AppComponent,
    ErrorSnackbarComponent,
    ErrorsHistorySnackbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatBottomSheetModule,
    MatListModule
  ],
  providers: [
    ...guards,
    {
      provide: 'ddp.config',
      useValue: sdkConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
