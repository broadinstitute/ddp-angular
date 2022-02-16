import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DecimalHelper } from '../../../utility/decimalHelper';

export class ActivityDecimalRangeValidationRule extends ActivityAbstractValidationRule {
    constructor(
        public question: ActivityQuestionBlock<any>,
        public min: number | null = null,
        public max: number | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        let valid = true;

        if (DecimalHelper.isDecimalAnswerType(this.question.answer)) {
            const answer = DecimalHelper.mapDecimalAnswerToNumber(this.question.answer);
            if (this.min && this.max === null) {
                valid = answer >= this.min;
            }
            if (this.max && this.min === null) {
                valid = answer <= this.max;
            }
            if (this.min && this.max) {
                valid = answer >= this.min && answer <= this.max;
            }
        }
        this.result = valid ? null : this.message;
        return valid;
    }
}
