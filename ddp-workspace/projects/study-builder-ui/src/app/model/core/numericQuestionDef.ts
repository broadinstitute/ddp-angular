import { Template } from './template';
import { AbstractQuestionDef } from './abstractQuestionDef';

export interface NumericQuestionDef extends AbstractQuestionDef {
  placeholderTemplate: Template;
  questionType: 'NUMERIC';
}
