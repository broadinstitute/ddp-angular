import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {DdpModule} from 'ddp-sdk';

import {NavigationComponent} from './layout/navigation/navigation.component';
import {FonComponent} from './fon.component';
import {ActivityComponent} from './pages/activities/components/activity/activity.component';
import {PatientsListComponent} from './pages/patients-list/patients-list.component';
import {ActivitiesComponent} from './pages/activities/activities.component';
import {HomeComponent} from './pages/home/home.component';
import {fonRoutingModule} from './fon-routing.module';
import {RegisterPatientsModalComponent} from './components/register-patients-modal/register-patients-modal.component';
import {openInModalDirective} from './directives/open-in-modal.directive';
import {InputFieldComponent} from './components/input-field/input-field.component';
import {PatientsService} from './services/patients.service';
import {HttpService} from './services/http.service';
import {FONHttpInterceptor} from './interceptors/http.interceptor';
import {MatTableModule} from '@angular/material/table';
import {TableComponent} from './pages/patients-list/components/table/table.component';
import { MatSortModule } from '@angular/material/sort';
import {CutStringPipe} from './pipes/cutString.pipe';
import {PaginatorComponent} from './components/paginator/paginator.component';
import { SearchPanelComponent } from './pages/patients-list/components/search-panel/search-panel.component';


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
  MatSnackBarModule,
  MatTableModule,
  MatSortModule
];

const directives = [openInModalDirective];

const pipes = [CutStringPipe];

const sharedComponents = [RegisterPatientsModalComponent, InputFieldComponent, PaginatorComponent];

const pageComponents = [
  FonComponent,
  ActivityComponent,
  PatientsListComponent,
  ActivitiesComponent,
  HomeComponent,
  TableComponent,
  SearchPanelComponent
];

const layoutComponents = [NavigationComponent];


@NgModule({
  declarations: [
    ...pageComponents,
    ...layoutComponents,
    ...sharedComponents,
    ...directives,
    ...pipes
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
}
