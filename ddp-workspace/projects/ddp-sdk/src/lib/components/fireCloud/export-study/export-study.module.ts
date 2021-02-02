import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ExportStudyComponent} from './exportStudy.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
  ],
  declarations: [ExportStudyComponent],
  exports: [ExportStudyComponent],
})
export class DdpExportStudyModule { }
