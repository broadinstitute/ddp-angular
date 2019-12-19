import { Component } from '@angular/core';
import { ActivityTextQuestionBlock, SuggestionMatch, TextSuggestion } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivityEmailQuestionBlock } from '../../../../../ddp-sdk/src/lib/models/activity/activityEmailQuestionBlock';

export interface TextParameters {
  readonly: boolean;
  shown: true;
  maxLength: number;
  inputType: string;
  question?: string;
  placeholder?: string;
  label?: string;
  initialValue?: string;
}

@Component({
  selector: 'app-sandbox-email-question',
  templateUrl: 'emailQuestion.component.html'
})
export class EmailQuestionComponent extends QuestionComponent<ActivityTextQuestionBlock> {
  constructor() {
    super();
    const parameters: TextParameters = {
      readonly: false,
      shown: true,
      maxLength: 15,
      question: 'What is your email?',
      label: 'Email',
      placeholder: 'Email',
      inputType: 'EMAIL',
      initialValue: 'no@uhuh.com'
    };

    this.inputParameters = JSON.stringify(parameters, null, '\t');
    this.readonly = parameters.readonly;
    this.question = this.buildBlock(parameters);
  }

  public update(): void {
    try {
      const parameters: TextParameters = JSON.parse(this.inputParameters);
      this.readonly = parameters.readonly;
      this.question = this.buildBlock(parameters);
    } catch (error) {
      this.validationMessage = `invalid parameters: ${error}`;
    }
  }

  private buildBlock(parameters: TextParameters): ActivityEmailQuestionBlock {
    const newQuestion = new ActivityEmailQuestionBlock();
    newQuestion.question = parameters.question;
    newQuestion.placeholder = parameters.placeholder;
    newQuestion.shown = parameters.shown;
    newQuestion.maxLength = parameters.maxLength;
    newQuestion.inputType = parameters.inputType;
    newQuestion.label = parameters.label;
    newQuestion.answer = parameters.initialValue;
    this.validationMessage = null;

    return newQuestion;
  }
}
