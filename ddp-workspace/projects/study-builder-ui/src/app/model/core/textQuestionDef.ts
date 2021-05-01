import { QuestionDef } from './questionDef';
import { Template } from './template';
import { TextInputType } from './textInputType';
import { SuggestionType } from './suggestiionType';
import { AbstractQuestionDef } from './abstractQuestionDef';

export interface TextQuestionDef extends AbstractQuestionDef {
  inputType: TextInputType;
  suggestionType: SuggestionType;
  placeholderTemplate: Template | null;
  suggestions: Array<string>;
  confirmEntry?: boolean;
  confirmPromptTemplate?: Template | null;
  mismatchMessageTemplate?: Template | null;
  questionType: 'TEXT';
}
