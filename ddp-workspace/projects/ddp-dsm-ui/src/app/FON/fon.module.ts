import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NavigationComponent} from './layout/navigation/navigation.component';
import {FonComponent} from './fon.component';
import {ActivityComponent} from './pages/activities/components/activity/activity.component';
import {PatientsListComponent} from './pages/patients-list/patients-list.component';
import {ActivitiesComponent} from './pages/activities/activities.component';
import {HomeComponent} from './pages/home/home.component';
import {fonRoutingModule} from './fon-routing.module';
import {CommonModule, DatePipe} from '@angular/common';
import {DdpModule} from 'ddp-sdk';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {RegisterPatientsModalComponent} from './components/register-patients-modal/register-patients-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {openInModalDirective} from './directives/open-in-modal.directive';
import {InputFieldComponent} from './components/input-field/input-field.component';
import {PatientsService} from './services/patients.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HttpService} from './services/http.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FONHttpInterceptor} from './interceptors/http.interceptor';


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
  MatDialogModule,
  MatSnackBarModule
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
    FlexLayoutModule,
    DdpModule.forDSM(),
    ...AngularMaterialModules,
  ],
  providers: [PatientsService, HttpService, DatePipe, {provide: HTTP_INTERCEPTORS, useClass: FONHttpInterceptor, multi: true}],
  exports: []
})

export class fonModule {
  constructor() {
  }
}
