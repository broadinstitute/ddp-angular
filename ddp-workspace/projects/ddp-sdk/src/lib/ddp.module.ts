import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Title } from '@angular/platform-browser';

// ngx-translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NGXTranslateService } from './services/internationalization/ngxTranslate.service';

// CookieService
import { CookieModule } from 'ngx-cookie';

// Angular JWT
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

// Shared components & services
import { ConfigurationService } from './services/configuration.service';
import { SessionMementoService } from './services/sessionMemento.service';
import { AnalyticsEventsService } from './services/analyticsEvents.service';
import { IrbPasswordService } from './services/irbPassword.service';
import { BrowserContentService } from './services/browserContent.service';
import { LanguageService } from './services/internationalization/languageService.service';

// Authentication components
import { Auth0AdapterService } from './services/authentication/auth0Adapter.service';
import { Auth0RenewService } from './services/authentication/auth0Renew.service';

import { UserProfileBusService } from './services/userProfileBus.service';

import { AuthGuard } from './guards/auth.guard';
import { AdminAuthGuard } from './guards/adminAuth.guard';
import { IrbGuard } from './guards/irb.guard';
import { BrowserGuard } from './guards/browser.guard';

// Logging components
import { LoggingService } from './services/logging.service';
import { StackdriverErrorReporterService } from './services/stackdriverErrorReporter.service';

import { ConsentServiceAgent } from './services/serviceAgents/consentServiceAgent.service';
// User activities
import { UserActivityServiceAgent } from './services/serviceAgents/userActivityServiceAgent.service';

import { UserProfileServiceAgent } from './services/serviceAgents/userProfileServiceAgent.service';
import { ActivityServiceAgent } from './services/serviceAgents/activityServiceAgent.service';
import { PrequalifierServiceAgent } from './services/serviceAgents/prequalifierServiceAgent.service';
import { GovernedParticipantsServiceAgent } from './services/serviceAgents/governedParticipantsServiceAgent.service';
import { FireCloudServiceAgent } from './services/serviceAgents/fireCloudServiceAgent.service';
import { ActivityInstanceStatusServiceAgent } from './services/serviceAgents/activityInstanceStatusServiceAgent.service';
import { MailingListServiceAgent } from './services/serviceAgents/mailingListServiceAgent.service';
import { InstitutionServiceAgent } from './services/serviceAgents/institutionServiceAgent.service';
import { ResendEmailServiceAgent } from './services/serviceAgents/resendEmailServiceAgent.service';

import { ActivityConverter } from './services/activity/activityConverter.service';
import { ActivityQuestionConverter } from './services/activity/activityQuestionConverter.service';
import { ActivityComponentConverter } from './services/activity/activityComponentConverter.service';
import { ActivityValidatorBuilder } from './services/activity/activityValidatorBuilder.service';
import { ActivitySuggestionBuilder } from './services/activity/activitySuggestionBuilder.service';
import { SubjectInvitationServiceAgent } from './services/serviceAgents/subjectInvitationServiceAgent.service';
import { UserInvitationServiceAgent } from './services/serviceAgents/userInvitationServiceAgent.service';
import { AnnouncementsServiceAgent } from './services/serviceAgents/announcementsServiceAgent.service';

import { WindowRef } from './services/windowRef';




import { ExceptionDispatcher } from './services/exceptionHandling/exceptionDispatcher.service';


// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatTooltipModule } from '@angular/material/tooltip';

import { ScriptLoaderService } from './services/scriptLoader.service';
import { AddressService } from './services/address.service';
import { AddressEntryDataService } from './services/addressEntryData.service';

import { DateService } from './services/dateService.service';
import { CountryService } from './services/addressCountry.service';
import { MedicalProvidersServiceAgent } from './services/serviceAgents/medicalProvidersServiceAgent.service';
import { WorkflowServiceAgent } from './services/serviceAgents/workflowServiceAgent.service';
import { SuggestionServiceAgent } from './services/serviceAgents/suggestionServiceAgent.service';
import { TemporaryUserServiceAgent } from './services/serviceAgents/temporaryUserServiceAgent.service';
import { InvitationServiceAgent } from './services/serviceAgents/invitationServiceAgent.service';

import { RenewSessionNotifier } from './services/renewSessionNotifier.service';

import { AuthInterceptor } from './interceptors/auth-interceptor.service';
import { LanguageServiceAgent } from './services/serviceAgents/languageServiceAgent.service';
import { DisplayLanguagePopupServiceAgent } from './services/serviceAgents/displayLanguagePopupServiceAgent.service';
import { StudyDetailServiceAgent } from './services/serviceAgents/studyDetailServiceAgent.service';
import { StatisticsServiceAgent } from './services/serviceAgents/statisticsServiceAgent.service';


export function jwtOptionsFactory(sessionService: SessionMementoService): object {
  const getter = () => sessionService.token;
  return {
    tokenGetter: getter
  };
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // FormsModule,
    // ReactiveFormsModule,
    // MatInputModule,
    // MatButtonModule,
    // MatCardModule,
    // MatToolbarModule,
    // MatProgressSpinnerModule,
    // MatMenuModule,
    // MatIconModule,
    // MatSnackBarModule,
    // MatSlideToggleModule,
    // MatChipsModule,
    // MatListModule,
    // MatExpansionModule,
    // MatTableModule,
    // MatPaginatorModule,
    // MatSelectModule,
    // MatDialogModule,
    // MatRadioModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatProgressBarModule,
    // MatFormFieldModule,
    // MatTabsModule,
    // MatCheckboxModule,
    // MatGridListModule,
    // MatStepperModule,
    // MatAutocompleteModule,
    // MatTooltipModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      }
    }),
    CookieModule.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [SessionMementoService]
      }
    }),
    RouterModule,
  ],
  providers: [
    AuthGuard,
    AdminAuthGuard,
    IrbGuard,
    BrowserGuard,
    Auth0AdapterService,
    Auth0RenewService,
    ConfigurationService,
    UserProfileBusService,
    LoggingService,
    SessionMementoService,
    AnalyticsEventsService,
    UserActivityServiceAgent,
    SubjectInvitationServiceAgent,
    UserProfileServiceAgent,
    ActivityServiceAgent,
    PrequalifierServiceAgent,
    GovernedParticipantsServiceAgent,
    ActivityInstanceStatusServiceAgent,
    LanguageServiceAgent,
    MailingListServiceAgent,
    ActivityValidatorBuilder,
    ActivitySuggestionBuilder,
    ActivityConverter,
    ActivityQuestionConverter,
    ActivityComponentConverter,
    FireCloudServiceAgent,
    WindowRef,
    ExceptionDispatcher,
    ConsentServiceAgent,
    AddressService,
    AddressEntryDataService,
    CountryService,
    DateService,
    InstitutionServiceAgent,
    ScriptLoaderService,
    MedicalProvidersServiceAgent,
    WorkflowServiceAgent,
    NGXTranslateService,
    SuggestionServiceAgent,
    IrbPasswordService,
    ResendEmailServiceAgent,
    AnnouncementsServiceAgent,
    UserInvitationServiceAgent,
    BrowserContentService,
    TemporaryUserServiceAgent,
    InvitationServiceAgent,
    Title,
    RenewSessionNotifier,
    LanguageService,
    DisplayLanguagePopupServiceAgent,
    StudyDetailServiceAgent,
    StatisticsServiceAgent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: StackdriverErrorReporterService
    }
  ],
  exports: [
    // TranslateModule
  ]
})
export class DdpModule { }
