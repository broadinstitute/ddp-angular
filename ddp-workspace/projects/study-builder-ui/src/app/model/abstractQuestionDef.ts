import { Template } from './template';
import { QuestionType } from './questionType';
import { RuleDef } from './ruleDef';

export interface AbstractQuestionDef {
  questionType: QuestionType;
  stableId: string;
  isRestricted: boolean;
  isDeprecated: boolean;
  promptTemplate: Template;
  tooltipTemplate?: Template | null;
  additionalInfoHeaderTemplate?: Template | null;
  additionalInfoFooterTemplate?: Template | null;
  validations: Array<RuleDef>;
  hideNumber: boolean;
  writeOnce?: boolean;
}
