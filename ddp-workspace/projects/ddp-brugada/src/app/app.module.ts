import { ToolkitModule } from 'toolkit';
import { RecaptchaModule } from 'ng-recaptcha';
import { ReactiveFormsModule } from '@angular/forms';
import { LOCATION_INITIALIZED } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatInputModule } from '@angular/material/input';
import { FaqComponent } from './pages/faq/faq.component';
import { SKDConfigProvider } from './config/sdk.provider';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HomeComponent } from './pages/home/home.component';
import { JoinComponent } from './pages/join/join.component';
import { TeamComponent } from './pages/team/team.component';
import { AppComponent } from './components/app/app.component';
import { AboutComponent } from './pages/about/about.component';
import { ErrorComponent } from './pages/error/error.component';
import { LoginComponent } from './pages/login/login.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { toolkitConfigProvider } from './config/toolkit.provider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule, Injector, APP_INITIALIZER } from '@angular/core';
import { DdpModule, LoggingService, LanguageService } from 'ddp-sdk';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PasswordComponent } from './pages/password/password.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ActivityComponent } from './components/activity/activity.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegistrationComponent } from './pages/registration/registration.component';
import { SignInOutComponent } from './components/sign-in-out/sign-in-out.component';
import { MailingListModalComponent } from './components/mailing-list-modal/mailing-list-modal.component';


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
    LoginComponent,
    SignInComponent,
    SignInOutComponent,
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
    HttpClientModule,
  ],
  providers: [
    SKDConfigProvider,
    toolkitConfigProvider,
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
