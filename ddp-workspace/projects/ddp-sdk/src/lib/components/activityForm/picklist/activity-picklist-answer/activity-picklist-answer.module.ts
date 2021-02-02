import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityPicklistAnswer} from './activityPicklistAnswer.component';
import {DdpQuestionPromptModule} from '../../question-prompt/question-prompt.module';
import {DdpRadiobuttonsActivityPicklistQuestionModule} from '../radiobuttons-activity-picklist-question/radiobuttons-activity-picklist-question.module';
import {DdpCheckboxesActivityPicklistQuestionModule} from '../checkboxes-activity-picklist-question/checkboxes-activity-picklist-question.module';
import {DdpDropdownActivityPicklistQuestionModule} from '../dropdown-activity-picklist-question/dropdown-activity-picklist-question.module';


@NgModule({
  imports: [
    CommonModule,
    DdpQuestionPromptModule,
    DdpRadiobuttonsActivityPicklistQuestionModule,
    DdpCheckboxesActivityPicklistQuestionModule,
    DdpDropdownActivityPicklistQuestionModule,
  ],
  declarations: [ActivityPicklistAnswer],
  exports: [ActivityPicklistAnswer],
})
export class DdpActivityPicklistAnswerModule { }
