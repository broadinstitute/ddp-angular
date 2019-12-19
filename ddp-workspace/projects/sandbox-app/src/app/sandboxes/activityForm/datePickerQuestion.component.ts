import { Component } from '@angular/core';
import { ActivityDateQuestionBlock, DateRenderMode, DateField } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';
import { DatePickerParameters } from '../../model/datePickerParameters';

@Component({
  selector: 'app-sandbox-date-picker-question',
  templateUrl: 'datePickerQuestion.component.html'
})
export class DatePickerQuestionComponent extends QuestionComponent<ActivityDateQuestionBlock> {
  constructor() {
    super();
    const parameters = {
      readonly: false,
      startYear: 1990,
      endYear: 2018,
      fields: [DateField.Day, DateField.Month, DateField.Year],
      renderMode: DateRenderMode.SingleText,
      displayCalendar: true
    };

    this.inputParameters = JSON.stringify(parameters, null, '\t');
    this.readonly = parameters.readonly;
    this.question = new ActivityDateQuestionBlock();
    this.question.displayCalendar = parameters.displayCalendar;
    this.question.startYear = parameters.startYear;
    this.question.endYear = parameters.endYear;
    this.question.fields = parameters.fields;
    this.question.id = 'AAA';
    this.question.question = 'sample question';
    this.question.renderMode = parameters.renderMode;
  }

  public update(): void {
    try {
      const parameters: DatePickerParameters = JSON.parse(this.inputParameters);
      this.readonly = parameters.readonly;
      this.question.startYear = parameters.startYear;
      this.question.endYear = parameters.endYear;
      this.question.fields = parameters.fields;
      this.question.renderMode = parameters.renderMode;
      this.question.displayCalendar = parameters.displayCalendar;
      this.validationMessage = null;
    } catch (error) {
      this.validationMessage = `invalid parameters: ${error}`;
    }
  }
}
