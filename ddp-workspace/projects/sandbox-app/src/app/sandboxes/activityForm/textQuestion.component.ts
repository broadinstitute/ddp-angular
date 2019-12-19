import { Component } from '@angular/core';
import { ActivityTextQuestionBlock, SuggestionMatch, TextSuggestion } from 'ddp-sdk';
import { QuestionComponent } from './questionComponent';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TextParameters {
  readonly: boolean;
  shown: true;
  maxLength: number;
  regexPattern: string;
  inputType: string;
  suggestions: Array<string>;
  autocomplete: boolean;
  question?: string;
  placeholder?: string;
  label?: string;
}

@Component({
  selector: 'app-sandbox-text-question',
  templateUrl: 'textQuestion.component.html'
})
export class TextQuestionComponent extends QuestionComponent<ActivityTextQuestionBlock> {
  constructor() {
    super();
    const parameters: TextParameters = {
      readonly: false,
      shown: true,
      maxLength: 80,
      regexPattern: '[a-zA-Z0-9-\n]+',
      question: 'Where do you live?',
      label: 'This is the label',
      placeholder: 'This is the placeholder',
      inputType: 'TEXT',
      suggestions: ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont', 'Concepcion', 'Alcorcon'],
      autocomplete: true
    };

    this.inputParameters = JSON.stringify(parameters, null, '\t');
    this.readonly = parameters.readonly;
    this.question = this.buildBlock(parameters);
  }

  public update(): void {
    try {
      const parameters: TextParameters = JSON.parse(this.inputParameters);
      this.readonly = parameters.readonly;
      const newQuestion = this.buildBlock(parameters);
      this.question = newQuestion;
    } catch (error) {
      this.validationMessage = `invalid parameters: ${error}`;
    }
  }

  private buildBlock(parameters: TextParameters) {
    const newQuestion = new ActivityTextQuestionBlock();
    newQuestion.question = parameters.question;
    newQuestion.placeholder = parameters.placeholder;
    newQuestion.shown = parameters.shown;
    newQuestion.maxLength = parameters.maxLength;
    newQuestion.regexPattern = parameters.regexPattern;
    newQuestion.inputType = parameters.inputType;
    newQuestion.label = parameters.label;
    this.validationMessage = null;
    if (parameters.autocomplete && parameters.suggestions) {
      newQuestion.textSuggestionSource = (value$: Observable<string>) => value$.pipe(
        map(value => this.findIncludedSuggestions(value, parameters.suggestions)),
        map(suggestions => this.sortSuggestionMatches(suggestions))
      );
    } else {
      newQuestion.textSuggestionSource = null;
    }
    return newQuestion;
  }

  private findIncludedSuggestions(value: string, suggestions: Array<string>): Array<TextSuggestion> {
    const values: Array<TextSuggestion> = [];
    const lowerCaseValue = value.toLowerCase();
    const length = value.length;
    suggestions.forEach(suggestion => {
      const lowerCaseSuggestion = suggestion.toLowerCase();
      if (lowerCaseSuggestion.indexOf(lowerCaseValue) > -1) {
        let position = -1;
        let step = 1;
        const matches: Array<SuggestionMatch> = [];
        while ((position = lowerCaseSuggestion.indexOf(lowerCaseValue, position + step)) !== -1) {
          matches.push({
            offset: position,
            length
          });
          if (step !== length) {
            step = length;
          }
        }
        values.push({
          value: suggestion,
          matches
        });
      }
    });
    return values;
  }

  private sortSuggestionMatches(suggestions: Array<TextSuggestion>): Array<TextSuggestion> {
    return suggestions.sort((a, b) => {
      a.matches.sort((a, b) => a.offset - b.offset);
      b.matches.sort((a, b) => a.offset - b.offset);
      return a.matches[0].offset - b.matches[0].offset;
    });
  }
}
