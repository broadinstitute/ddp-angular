import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckboxesActivityPicklistQuestion} from './checkboxesActivityPicklistQuestion.component';
import {DdpTooltipModule as DdpTooltipModule} from '../../../tooltip/tooltip.module';

import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  imports: [
    CommonModule,
    DdpTooltipModule,

    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    CheckboxesActivityPicklistQuestion,
  ],
  exports: [
    CheckboxesActivityPicklistQuestion,
  ]
})
export class DdpCheckboxesActivityPicklistQuestionModule { }
