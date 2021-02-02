import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {FireCloudListWorkspacesComponent} from './listWorkspaces.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
  ],
  declarations: [FireCloudListWorkspacesComponent],
  exports: [FireCloudListWorkspacesComponent],
})
export class DdpListWorkspacesModule { }
