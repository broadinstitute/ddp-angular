import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule, Routes} from "@angular/router";
import {UsersAndPermissionsComponent} from "./usersAndPermissions.component";
import {ListAdministrationUsersComponent} from "./components/listAdministrationUsers/listAdministrationUsers.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {PermissionCheckboxComponent} from "./components/permissionCheckbox/permissionCheckbox.component";
import {MatDividerModule} from "@angular/material/divider";
import {MatTooltipModule} from "@angular/material/tooltip";
import {AdministrationUserComponent} from "./components/AdministrationUser/administrationUser.component";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ComparePermissionsComponent} from "./components/comparePermissions/comparePermissions.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";

const routes: Routes = [
  {path: '', component: UsersAndPermissionsComponent}
]

@NgModule({
  declarations: [
    UsersAndPermissionsComponent,
    ListAdministrationUsersComponent,
    PermissionCheckboxComponent,
    AdministrationUserComponent,
    ComparePermissionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
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
    MatSelectModule
  ],
})
export class UsersAndPermissionsModule {}
