import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';

export class ActivityRequiredValidationRule extends ActivityAbstractValidationRule {
    constructor(question: ActivityQuestionBlock<any>) {
        super(question);
    }

    public recalculate(): boolean {
        const isValid = this.question.hasAnswer();
        this.result = isValid ? null : this.message;

        return isValid;
    }
}
