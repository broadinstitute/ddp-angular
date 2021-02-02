import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FireCloudListStudiesComponent} from './listStudies.component';
import {MatTableModule} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
  ],
  declarations: [FireCloudListStudiesComponent],
  exports: [FireCloudListStudiesComponent],
})
export class DdpListStudiesModule { }
