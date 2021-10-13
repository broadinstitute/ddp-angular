import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityDynamicDropdownQuestionBlock extends ActivityQuestionBlock<string> {
  public get questionType(): QuestionType {
    return QuestionType.DynamicDropdown;
  }
}
