import { AbstractQuestionDef } from './abstractQuestionDef';
import { Template } from './template';

export interface BooleanQuestionDef extends AbstractQuestionDef {
  trueTemplate: Template;
  falseTemplate: Template;
  readonly questionType: 'BOOLEAN';
}
