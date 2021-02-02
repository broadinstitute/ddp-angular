import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownActivityPicklistQuestion} from './dropdownActivityPicklistQuestion.component';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';


@NgModule({
  declarations: [DropdownActivityPicklistQuestion],
  exports: [DropdownActivityPicklistQuestion],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
  ]
})
export class DdpDropdownActivityPicklistQuestionModule { }
