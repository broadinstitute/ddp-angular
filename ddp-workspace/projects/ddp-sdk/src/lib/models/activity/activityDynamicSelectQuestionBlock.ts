import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityDynamicSelectQuestionBlock extends ActivityQuestionBlock<string> {
  public get questionType(): QuestionType {
    return QuestionType.DynamicSelect;
  }
}
