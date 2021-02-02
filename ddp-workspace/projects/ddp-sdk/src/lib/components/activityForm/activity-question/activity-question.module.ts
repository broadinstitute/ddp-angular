import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivityQuestionComponent} from './activityQuestion.component';
import {DdpValidationMessageModule} from '../../validation-message/validation-message.module';
import {DdpActivityAnswerModule} from '../activity-answer/activity-answer.module';


@NgModule({
  imports: [
    CommonModule,
    DdpValidationMessageModule,
    DdpActivityAnswerModule,
  ],
  exports: [ActivityQuestionComponent],
  declarations: [ActivityQuestionComponent],
})
export class DdpActivityQuestionModule { }
