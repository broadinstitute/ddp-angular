import { Template } from './template';
import { NumericType } from './numericType';
import { AbstractQuestionDef } from './abstractQuestionDef';

export interface NumericQuestionDef extends AbstractQuestionDef {
  numericType: NumericType;
  placeholderTemplate: Template;
  questionType: 'NUMERIC';
}
