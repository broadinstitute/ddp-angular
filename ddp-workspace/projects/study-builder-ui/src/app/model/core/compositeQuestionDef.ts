import { AbstractQuestionDef } from './abstractQuestionDef';
import { Template } from './template';
import { QuestionDef } from './questionDef';
import { OrientationType } from './orientationType';

export interface CompositeQuestionDef extends AbstractQuestionDef {
  children: Array<QuestionDef>;
  childOrientation: OrientationType;
  allowMultiple: boolean;
  unwrapOnExport: boolean;
  additionalItemTemplate: Template | null;
  addButtonTemplate: Template;
  questionType: 'COMPOSITE';
}
