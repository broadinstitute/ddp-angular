import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UsersAndPermissionsComponent} from './usersAndPermissions.component';
import {ListUsersComponent} from './components/listUsers/listUsers.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {PermissionCheckboxComponent} from './components/permissionCheckbox/permissionCheckbox.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AdministrationUserComponent} from './components/user/administrationUser.component';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ComparePermissionsComponent} from './components/comparePermissions/comparePermissions.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {AddUserComponent} from './components/addUser/addUser.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ErrorMessageComponent} from "./components/error-message/error-message.component";
import {UsersAndPermissionsHttpService} from "./services/usersAndPermissionsHttp.service";
import {UsersAndPermissionsStateService} from "./services/usersAndPermissionsState.service";

const routes: Routes = [
  {path: '', component: UsersAndPermissionsComponent}
];

@NgModule({
  declarations: [
    UsersAndPermissionsComponent,
    ListUsersComponent,
    PermissionCheckboxComponent,
    AdministrationUserComponent,
    ComparePermissionsComponent,
    AddUserComponent,
    ErrorMessageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule
  ],
  providers: [
    UsersAndPermissionsHttpService,
    UsersAndPermissionsStateService
  ]
})
export class UsersAndPermissionsModule {
}
