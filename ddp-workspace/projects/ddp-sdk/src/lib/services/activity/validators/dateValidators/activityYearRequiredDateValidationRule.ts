import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from '../activityAbstractValidationRule';
import { DatePickerValue } from '../../../../models/datePickerValue';

export class ActivityYearRequiredDateValidationRule extends ActivityAbstractValidationRule {
    constructor(
        question: ActivityQuestionBlock<DatePickerValue>) {
        super(question);
    }

    public recalculate(): boolean {
        if (this.question.answer != null) {
            const value = this.question.answer;
            if (!this.isBlank(value) && value.year === null) {
                this.result = this.message;
                return false;
            }
        }
        this.result = null;
        return true;
    }

    private isBlank(value: DatePickerValue): boolean {
        return value.year === null && value.month === null && value.day === null;
    }
}
