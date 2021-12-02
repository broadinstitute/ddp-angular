import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityInstanceSelectQuestionBlock extends ActivityQuestionBlock<string> {
  public get questionType(): QuestionType {
    return QuestionType.ActivityInstanceSelect;
  }

  public hasAnswer(): boolean {
    return this.answer != null;
  }
}
