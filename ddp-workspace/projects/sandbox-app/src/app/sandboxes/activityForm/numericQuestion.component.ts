import { Component } from '@angular/core';
import { ActivityNumericQuestionBlock, NumericType } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';

export interface NumericParameters {
  answer: number,
  readonly: boolean;
  shown: true;
  numericType: NumericType;
  min: number | null;
  max: number | null;
  question?: string;
  placeholder?: string;
  label?: string;
}

@Component({
  selector: 'app-sandbox-numeric-question',
  templateUrl: 'numericQuestion.component.html'
})
export class NumericQuestionComponent extends QuestionComponent<ActivityNumericQuestionBlock> {
  constructor() {
    super();
    const parameters: NumericParameters = {
      answer: 5,
      readonly: false,
      shown: true,
      min: 0,
      max: 100,
      question: 'What is your age?',
      label: 'This is the label',
      placeholder: 'This is the placeholder',
      numericType: NumericType.Integer
    };

    this.inputParameters = JSON.stringify(parameters, null, '\t');
    this.readonly = parameters.readonly;
    this.question = this.buildBlock(parameters);
  }

  public update(): void {
    try {
      const parameters: NumericParameters = JSON.parse(this.inputParameters);
      this.readonly = parameters.readonly;
      const newQuestion = this.buildBlock(parameters);
      this.question = newQuestion;
    } catch (error) {
      this.validationMessage = `invalid parameters: ${error}`;
    }
  }

  private buildBlock(parameters: NumericParameters) {
    const newQuestion = new ActivityNumericQuestionBlock();
    newQuestion.answer = parameters.answer;
    newQuestion.question = parameters.question;
    newQuestion.placeholder = parameters.placeholder;
    newQuestion.min = parameters.min;
    newQuestion.max = parameters.max;
    newQuestion.shown = parameters.shown;
    newQuestion.numericType = parameters.numericType;
    newQuestion.label = parameters.label;
    this.validationMessage = null;
    return newQuestion;
  }
}
