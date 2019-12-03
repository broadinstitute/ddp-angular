import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityLengthValidationRule extends ActivityAbstractValidationRule {
    constructor(
        question: ActivityQuestionBlock<string>,
        public minLength: number | null = null,
        public maxLength: number | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        if (this.question.answer !== null &&
            ((this.minLength !== null && this.question.answer.length < this.minLength)
                || (this.maxLength != null && this.question.answer.length > this.maxLength))) {
            this.result = this.message;
            return false;
        } else {
            this.result = null;
            return true;
        }
    }
}