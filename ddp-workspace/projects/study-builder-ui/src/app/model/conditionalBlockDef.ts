import { AbstractQuestionDef } from './abstractQuestionDef';
import { FormBlockDef } from './formBlockDef';
import { QuestionDef } from './questionDef';
import { AbstractFormBlockDef } from './abstractFormBlockDef';

export interface ConditionalBlockDef extends AbstractFormBlockDef {
  control: QuestionDef;
  nested: Array<FormBlockDef>;
  blockType: 'CONDITIONAL';
}
