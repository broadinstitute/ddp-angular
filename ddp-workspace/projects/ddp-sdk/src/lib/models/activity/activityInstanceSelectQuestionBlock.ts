import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityInstanceSelectQuestionBlock extends ActivityQuestionBlock<string> {
  public get questionType(): QuestionType {
    return QuestionType.ActivityInstanceSelect;
  }
}
