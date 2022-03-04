import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import * as _ from 'underscore';

export class ActivityNumericRangeValidationRule extends ActivityAbstractValidationRule {
    constructor(
        public question: ActivityQuestionBlock<number>,
        public min: number | null = null,
        public max: number | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        let valid = true;
        const answer = this.question.answer;
        if (_.isNumber(answer)) {
            if (_.isNumber(this.min)) {
                valid = answer >= this.min;
            }
            if (_.isNumber(this.max)) {
                valid = valid && (answer <= this.max);
            }
        }
        this.result = valid ? null : this.message;
        return valid;
    }
}
