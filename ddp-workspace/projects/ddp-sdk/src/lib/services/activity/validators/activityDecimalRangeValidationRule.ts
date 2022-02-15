import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DecimalAnswer } from '../../../models/activity/activityDecimalQuestionBlock';
import { DecimalHelper } from '../../../utility/decimalHelper';

export class ActivityDecimalRangeValidationRule extends ActivityAbstractValidationRule {
    constructor(
        public question: ActivityQuestionBlock<any>,
        public min: DecimalAnswer | null = null,
        public max: DecimalAnswer | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        let valid = true;

        if (DecimalHelper.isDecimalAnswerType(this.question.answer)) {
            const answer = DecimalHelper.mapDecimalAnswerToNumber(this.question.answer);
            const min = this.min && DecimalHelper.mapDecimalAnswerToNumber(this.min);
            const max = this.max && DecimalHelper.mapDecimalAnswerToNumber(this.max);

            if (min && max === null) {
                valid = answer >= min;
            }
            if (max && min === null) {
                valid = answer <= max;
            }
            if (min && max) {
                valid = answer >= min && answer <= max;
            }
        }

        this.result = valid ? null : this.message;
        return valid;
    }
}
