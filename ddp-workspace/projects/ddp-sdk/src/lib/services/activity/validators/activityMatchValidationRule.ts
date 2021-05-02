import { ActivityTextQuestionBlock } from '../../../models/activity/activityTextQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityMatchValidationRule extends ActivityAbstractValidationRule {
  constructor(private block: ActivityTextQuestionBlock) {
    super(block);
  }

  public recalculate(): boolean {
    const doValuesMatch = this.block.answer === this.block.confirmationAnswer;

    this.result = doValuesMatch ? null : this.block.mismatchMessage;

    return doValuesMatch;
  }
}
