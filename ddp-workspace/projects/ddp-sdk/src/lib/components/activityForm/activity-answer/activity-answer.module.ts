import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Material
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

import {DdpActivityPicklistAnswerModule} from '../picklist/activity-picklist-answer/activity-picklist-answer.module';
import {DdpQuestionPromptModule} from '../question-prompt/question-prompt.module';
import {DdpActivityEmailInputModule} from '../activity-email-input/activity-email-input.module';
import {DdpDatePickerModule} from '../../date-picker/date-picker.module';

import {ActivityAnswerComponent} from './activityAnswer.component';
import {ActivityAgreementAnswer} from './activityAgreementAnswer.component';
import {ActivityBooleanAnswer} from './activityBooleanAnswer.component';
import {ActivityTextAnswer} from './activityTextAnswer.component';
import {ActivityNumericAnswer} from './activityNumericAnswer.component';
import {ActivityDateAnswer} from './activityDateAnswer.component';
import {ActivityCompositeAnswer} from './activityCompositeAnswer.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,

    DdpActivityPicklistAnswerModule,
    DdpQuestionPromptModule,
    DdpActivityEmailInputModule,
    DdpDatePickerModule,
  ],
  declarations: [
    ActivityAnswerComponent,
    ActivityAgreementAnswer,
    ActivityBooleanAnswer,
    ActivityTextAnswer,
    ActivityNumericAnswer,
    ActivityDateAnswer,
    ActivityCompositeAnswer
  ],
  exports: [
    ActivityAnswerComponent,
    ActivityCompositeAnswer,
  ],
})
export class DdpActivityAnswerModule { }
