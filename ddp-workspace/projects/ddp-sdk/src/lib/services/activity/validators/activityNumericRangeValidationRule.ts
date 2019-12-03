import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import * as _ from 'underscore';

export class ActivityNumericRangeValidationRule extends ActivityAbstractValidationRule {
    constructor(
        public question: ActivityQuestionBlock<any>,
        public min: number | null = null,
        public max: number | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        let valid = true;
        const answer = this.question.answer;
        if (answer !== null && _.isNumber(answer)) {
            if (_.isNumber(this.min) && this.max === null) {
                valid = answer < this.min ? false : true;
            }
            if (_.isNumber(this.max) && this.min === null) {
                valid = answer > this.max ? false : true;
            }
            if (_.isNumber(this.max) && _.isNumber(this.min)) {
                valid = answer >= this.min && answer <= this.max ? true : false;
            }
        }
        this.result = valid ? null : this.message;
        return valid;
    }
}
