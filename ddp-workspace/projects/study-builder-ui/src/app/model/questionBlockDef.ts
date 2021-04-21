import { QuestionDef } from './questionDef';
import { AbstractFormBlockDef } from './abstractFormBlockDef';

export interface QuestionBlockDef extends AbstractFormBlockDef {
  question: QuestionDef;
  blockType: 'QUESTION';
}
