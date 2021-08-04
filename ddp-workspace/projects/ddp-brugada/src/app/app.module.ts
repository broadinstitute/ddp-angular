import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule, Injector, APP_INITIALIZER, InjectionToken } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LOCATION_INITIALIZED } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';

import {
  DdpModule,
  ConfigurationService,
  LoggingService,
  LanguageService,
} from 'ddp-sdk';

import { ToolkitModule, ToolkitConfigurationService } from 'toolkit';

import { ActivityComponent } from './components/activity/activity.component';
import { AppComponent } from './components/app/app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MailingListModalComponent } from './components/mailing-list-modal/mailing-list-modal.component';
import { Route } from './constants/Route';
import { AboutComponent } from './pages/about/about.component';
import { ErrorComponent } from './pages/error/error.component';
import { FaqComponent } from './pages/faq/faq.component';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { PasswordComponent } from './pages/password/password.component';
import { TeamComponent } from './pages/team/team.component';
import { AppRoutingModule } from './app-routing.module';
import { RegistrationComponent } from './pages/registration/registration.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';


export const CONFIG: InjectionToken<ConfigurationService> = new InjectionToken<ConfigurationService>('Config');

const base = document.querySelector('base')?.getAttribute('href') || '';

declare const DDP_ENV: any;

export const toolkitConfig = new ToolkitConfigurationService();
toolkitConfig.studyGuid = DDP_ENV.studyGuid;
toolkitConfig.errorUrl = Route.Error;
toolkitConfig.recaptchaSiteClientKey = DDP_ENV.recaptchaSiteClientKey;

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
sdkConfig.dbName = DDP_ENV.dbName;
sdkConfig.errorPageUrl = Route.Error;
sdkConfig.passwordPageUrl = Route.Password;

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
    ActivityComponent,
    AppComponent,
    FooterComponent,
    HeaderComponent,
    MailingListModalComponent,
    AboutComponent,
    ErrorComponent,
    FaqComponent,
    HomeComponent,
    JoinComponent,
    PasswordComponent,
    TeamComponent,
    RegistrationComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RecaptchaModule,
    DdpModule,
    ToolkitModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: 'ddp.config',
      useValue: sdkConfig,
    },
    // TODO: Use InjectionToken instead of string token
    // {
    //   provide: CONFIG,
    //   useValue: sdkConfig,
    // },
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
