import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {DatePickerComponent} from './datePicker.component';
import {InputRestrictionModule} from '../../directives/input-restriction/input-restriction.module';
// import { DdpModule } from 'ddp-sdk';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    InputRestrictionModule,

    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent],
})
export class DdpDatePickerModule { }
