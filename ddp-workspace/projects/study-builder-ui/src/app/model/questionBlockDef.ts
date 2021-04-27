import { QuestionDef } from './questionDef';
import { AbstractFormBlockDef } from './abstractFormBlockDef';

export interface QuestionBlockDef<QuestionDefType extends QuestionDef> extends AbstractFormBlockDef {
  question: QuestionDefType;
  blockType: 'QUESTION';
}
