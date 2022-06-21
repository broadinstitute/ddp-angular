import {NgModule} from '@angular/core';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {FonComponent} from './fon.component';
import {ActivityComponent} from './pages/activities/components/activity/activity.component';
import {PatientsListComponent} from './pages/patients-list/patients-list.component';
import {ActivitiesComponent} from './pages/activities/activities.component';
import {HomeComponent} from './pages/home/home.component';
import {fonRoutingModule} from './fon-routing.module';
import {CommonModule} from '@angular/common';
import {DdpModule, SessionMementoService} from 'ddp-sdk';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {StoreService} from '../STORE/store.service';
import {MainConstants} from './constants/main-constants';
import {TranslateService} from '@ngx-translate/core';
import {SessionService} from '../services/session.service';
import {Title} from '@angular/platform-browser';
import {RegisterPatientsModalComponent} from './components/register-patients-modal/register-patients-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {openInModalDirective} from './directives/open-in-modal.directive';
import {InputFieldComponent} from './components/input-field/input-field.component';
import {JwtHelperService} from '@auth0/angular-jwt';


const AngularMaterialModules = [
  MatExpansionModule,
  MatDividerModule,
  MatListModule,
  MatIconModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatDialogModule
];

const directives = [openInModalDirective];

const components = [RegisterPatientsModalComponent, InputFieldComponent];

const pageComponents = [
  FonComponent,
  ActivityComponent,
  PatientsListComponent,
  ActivitiesComponent,
  HomeComponent
];

const layoutComponents = [NavigationComponent];


@NgModule({
  declarations: [
    ...pageComponents,
    ...layoutComponents,
    ...components,
    ...directives
  ],
  imports: [
    CommonModule,
    fonRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DdpModule.forDSM(),
    ...AngularMaterialModules,
  ],
  providers: [],
  exports: []
})

export class fonModule {
  constructor(private storeService: StoreService,
              private translateService: TranslateService,
              private sessionService: SessionService,
              private dssSessionService: SessionMementoService,
              private title: Title,
              private jwtHelper: JwtHelperService
              ) {

    const LOCALE = 'en';

    // Title
    this.title.setTitle('Fon');

    // Token
    const DSMToken = this.sessionService.getDSMToken();
    const userGuid = this.jwtHelper.decodeToken(DSMToken)['https://datadonationplatform.org/cid'];
    this.sessionService.setExpirationTime(DSMToken);
    this.dssSessionService.setSession(null, DSMToken, userGuid, LOCALE, +this.sessionService.getTokenExpiration());

    // Store
    this.storeService.setStudy = MainConstants.study;
    this.storeService.dispatchGetSettings(MainConstants.participantsListParent);

    // Translation
    this.translateService.setDefaultLang(LOCALE);
    this.translateService.use(LOCALE);
  }
}
