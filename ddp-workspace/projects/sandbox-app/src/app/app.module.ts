import { Auth0CodeCallbackComponent, ConfigurationService, DdpModule, LogLevel } from 'ddp-sdk';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NavigationEnd, Router, RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SilentRenewComponent } from './silentRenew.component';
import { DefaultComponent } from './default.component';

import { LoginSandboxComponent } from './sandboxes/loginSandbox.component';
import { UserProfileSandboxComponent } from './sandboxes/userProfileSandbox.component';
import { ParticipantProfileSandboxComponent } from './sandboxes/participantProfileSandbox.component';
import { ActivitiesListSandboxComponent } from './sandboxes/activitiesListSandbox.component';
import { ActivitySandboxComponent } from './sandboxes/activitySandbox.component';

import { DatePickerQuestionComponent } from './sandboxes/activityForm/datePickerQuestion.component';
import { TextQuestionComponent } from './sandboxes/activityForm/textQuestion.component';
import { NumericQuestionComponent } from './sandboxes/activityForm/numericQuestion.component';
import { BooleanQuestionComponent } from './sandboxes/activityForm/booleanQuestion.component';
import { CompositeQuestionComponent } from './sandboxes/activityForm/compositeQuestion.component';
import { AgreementQuestionComponent } from './sandboxes/activityForm/agreementQuestion.component';
import { PicklistQuestionComponent } from './sandboxes/activityForm/picklistQuestion.component';
import { PhysicianInfoComponent } from './sandboxes/activityForm/physicianInfo.component';
import { PagedActivityComponent } from './sandboxes/activityForm/pagedActivity.component';
import { ReadonlyActivityFormComponent } from './sandboxes/activityForm/readonlyActivityForm.component';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';

import { OverlayModule } from '@angular/cdk/overlay';

import { FireCloudStudiesSandboxComponent } from './sandboxes/firecloudStudiesSandbox.component';

import { InstitutionInfoComponent } from './sandboxes/activityForm/institutionInfo.component';
import { AgreementInfoComponent } from './sandboxes/activityForm/agreementInfo.component';
import { EssayInfoComponent } from './sandboxes/activityForm/essayInfo.component';
import { AddressEmbeddedSandboxComponent } from './sandboxes/activityForm/addressEmbeddedSandbox.component';
import { LoginLandingComponent, ToolkitConfigurationService, ToolkitModule } from 'toolkit';

const baseElt = document.getElementsByTagName('base');
let base = '';
if (baseElt) {
  base = baseElt[0].getAttribute('href');
}


declare let DDP_ENV: any;

export const config = new ConfigurationService();
config.backendUrl = DDP_ENV.basePepperUrl;
config.auth0Domain = DDP_ENV.auth0Domain;
config.auth0ClientId = DDP_ENV.auth0ClientId;
config.studyGuid = DDP_ENV.studyGuid;
config.logLevel = LogLevel.Debug;
config.baseUrl = location.origin + base;
config.auth0SilentRenewUrl = DDP_ENV.auth0SilentRenewUrl;
config.loginLandingUrl = DDP_ENV.loginLandingUrl;
config.auth0CodeRedirect = location.origin + base + 'auth';
config.localRegistrationUrl = config.backendUrl + '/pepper/v1/register';
config.doLocalRegistration = DDP_ENV.doLocalRegistration;
config.mapsApiKey = DDP_ENV.mapsApiKey;
config.auth0Audience = DDP_ENV.auth0Audience;
config.projectGAToken = DDP_ENV.projectGAToken;

export const tkCfg = new ToolkitConfigurationService();
tkCfg.studyGuid = DDP_ENV.studyGuid;
tkCfg.aboutYouGuid = 'ABOUTYOU';
tkCfg.consentGuid = 'CONSENT';
tkCfg.releaseGuid = 'RELEASE';
tkCfg.dashboardGuid = 'DASHBOARD';
tkCfg.aboutYouUrl = 'about-you';
tkCfg.aboutUsUrl = 'about-us';
tkCfg.consentUrl = 'consent';
tkCfg.releaseUrl = 'release-survey';
tkCfg.dashboardUrl = 'dashboard';
tkCfg.activityUrl = 'activity';
tkCfg.errorUrl = 'error';
tkCfg.stayInformedUrl = 'stay-informed';
tkCfg.moreDetailsUrl = 'more-details';
tkCfg.internationalPatientsUrl = 'international-patients';
tkCfg.phone = '651-229-3480';
tkCfg.infoEmail = 'info@braincancerproject.org';
tkCfg.dataEmail = 'data@braincancerproject.org';
tkCfg.twitterAccountId = 'BrainCancerProj';
tkCfg.facebookGroupId = 'braincancerproject';
tkCfg.countMeInUrl = 'https://joincountmein.org/';
tkCfg.showDataRelease = false;
tkCfg.showInfoForPhysicians = true;
tkCfg.showBlog = false;
tkCfg.blogUrl = '';

const appRoutes: Routes = [
  { path: 'fireCloudStudies', component: FireCloudStudiesSandboxComponent },
  { path: 'silentRenew', component: SilentRenewComponent },
  { path: 'login-landing', component: LoginLandingComponent },
  { path: '', component: DefaultComponent },
  { path: 'login', component: LoginSandboxComponent },
  { path: 'userprofile', component: UserProfileSandboxComponent },
  { path: 'participantprofile', component: ParticipantProfileSandboxComponent },
  { path: 'activitiesList', component: ActivitiesListSandboxComponent },
  { path: 'activity', component: ActivitySandboxComponent },
  { path: 'date-picker-question', component: DatePickerQuestionComponent },
  { path: 'text-question', component: TextQuestionComponent },
  { path: 'numeric-question', component: NumericQuestionComponent },
  { path: 'boolean-question', component: BooleanQuestionComponent },
  { path: 'composite-question', component: CompositeQuestionComponent },
  { path: 'agreement-question', component: AgreementQuestionComponent },
  { path: 'picklist-question', component: PicklistQuestionComponent },
  { path: 'physician-info', component: PhysicianInfoComponent },
  { path: 'readonly-activity-form', component: ReadonlyActivityFormComponent },
  { path: 'auth', component: Auth0CodeCallbackComponent },
  { path: 'institution-info', component: InstitutionInfoComponent },
  { path: 'paged-activity', component: PagedActivityComponent },
  { path: 'agreement-info', component: AgreementInfoComponent },
  { path: 'essay-info', component: EssayInfoComponent },
  { path: 'address-embedded', component: AddressEmbeddedSandboxComponent },
  { path: '**', redirectTo: '' }
];

declare const ga: (...args: any[]) => void;

@NgModule({
  declarations: [
    AppComponent,
    SilentRenewComponent,
    DefaultComponent,
    LoginSandboxComponent,
    UserProfileSandboxComponent,
    ParticipantProfileSandboxComponent,
    ActivitiesListSandboxComponent,
    AddressEmbeddedSandboxComponent,
    ActivitySandboxComponent,
    ActivitySandboxComponent,
    FireCloudStudiesSandboxComponent,
    DatePickerQuestionComponent,
    TextQuestionComponent,
    NumericQuestionComponent,
    PagedActivityComponent,
    BooleanQuestionComponent,
    CompositeQuestionComponent,
    AgreementQuestionComponent,
    PicklistQuestionComponent,
    PhysicianInfoComponent,
    ReadonlyActivityFormComponent,
    InstitutionInfoComponent,
    AgreementInfoComponent,
    EssayInfoComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        relativeLinkResolution: 'legacy'
      }
    ),
    BrowserModule,
    DdpModule,
    ToolkitModule,
    MatButtonModule, MatToolbarModule, MatIconModule, MatMenuModule, MatCardModule,
    MatGridListModule, MatInputModule, MatRadioModule, MatSidenavModule,
    MatExpansionModule, MatListModule, MatSlideToggleModule, MatSelectModule,
    MatTooltipModule, MatAutocompleteModule,
    FormsModule, FlexLayoutModule, OverlayModule
  ],
  providers: [
    { provide: 'ddp.config', useValue: config },
    {
      provide: 'toolkit.toolkitConfig',
      useValue: tkCfg
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
}
