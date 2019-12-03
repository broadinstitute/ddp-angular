import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from '../activityAbstractValidationRule';
import { DatePickerValue } from '../../../../models/datePickerValue';

export class ActivityDayRequiredDateValidationRule extends ActivityAbstractValidationRule {
    constructor(
        question: ActivityQuestionBlock<DatePickerValue>) {
        super(question);
    }

    public recalculate(): boolean {
        if (this.question.answer != null) {
            let value = this.question.answer;
            if (value.day == null) {
                this.result = this.message;
                return false;
            }
        }
        this.result = null;
        return true;
    }
}
