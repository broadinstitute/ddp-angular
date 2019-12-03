import { ActivityQuestionBlock } from "../../../../models/activity/activityQuestionBlock";
import { ActivityAbstractValidationRule } from "../activityAbstractValidationRule";
import { DatePickerValue } from '../../../../models/datePickerValue';
import { DateService } from '../../../dateService.service';

export class ActivityDateNavyValidationRule extends ActivityAbstractValidationRule {
    constructor(
        question: ActivityQuestionBlock<DatePickerValue>,
        private dateService: DateService) {
        super(question);
    }

    public recalculate(): boolean {
        if (this.question.answer != null) {
            if (this.isDateReadyForSave(this.question.answer)) {
                this.result = null;
                return true;
            } else {
                this.result = 'Entered date is invalid';
                return false;
            }
        }
        this.result = null;
        return true;
    }

    public isDateReadyForSave(value: DatePickerValue): boolean {
        if (value.year === 0 || value.month === 0 || value.day === 0) {
            return false;
        }
        const effectiveYear = value.year ? value.year : 2000;
        const effectiveMonth = value.month ? value.month : 1;
        const effectiveDay =  value.day ? value.day : 1;
        if (!value.year && !value.month && !value.day) {
            return true;
        }
        return this.dateService.checkExistingDate(
            effectiveYear,
            effectiveMonth,
            effectiveDay);
    }
}
