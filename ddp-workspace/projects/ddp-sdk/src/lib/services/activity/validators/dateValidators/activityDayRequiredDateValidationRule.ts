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
            const value = this.question.answer;
            if (!this.isBlank(value) && value.day === null) {
                this.result = this.message;
                return false;
            } else {
                this.result = null;
                return true;
            }
        }
        this.result = this.message;
        return false;
    }

    private isBlank(value: DatePickerValue): boolean {
        return value.year === null && value.month === null && value.day === null;
    }
}
