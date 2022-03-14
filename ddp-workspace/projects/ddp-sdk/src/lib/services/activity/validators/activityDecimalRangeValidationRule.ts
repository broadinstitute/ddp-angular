import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DecimalHelper } from '../../../utility/decimalHelper';
import * as _ from 'underscore';

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
