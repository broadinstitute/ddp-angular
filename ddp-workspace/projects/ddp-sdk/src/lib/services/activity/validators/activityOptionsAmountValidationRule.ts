import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityOptionsAmountValidationRule extends ActivityAbstractValidationRule {
    private outcome: boolean;

    constructor(
        question: ActivityQuestionBlock<ActivityPicklistAnswerDto[]>,
        public minimumSelection: number,
        public maximumSelection: number) {
        super(question);
    }

    public recalculate(): boolean {
        let length = 0;
        if (this.question.answer && this.question.answer.length) {
            length = this.question.answer.length;
        }
        if (length >= this.minimumSelection && length <= this.maximumSelection) {
            this.result = null;
            this.outcome = true;
        } else {
            this.result = this.message;
            this.outcome = false;
        }

        return this.outcome;
    }
}
