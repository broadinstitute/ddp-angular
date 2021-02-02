import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RadioButtonsActivityPicklistQuestion} from './radiobuttonsActivityPicklistQuestion.component';
import {DdpTooltipModule as DdpTooltipModule} from '../../../tooltip/tooltip.module';

import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    DdpTooltipModule,

    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    RadioButtonsActivityPicklistQuestion,
  ],
  exports: [
    RadioButtonsActivityPicklistQuestion,
  ],
})
export class DdpRadiobuttonsActivityPicklistQuestionModule { }
