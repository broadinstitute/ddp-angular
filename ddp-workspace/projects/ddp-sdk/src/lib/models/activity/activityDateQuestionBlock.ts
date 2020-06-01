import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { DatePickerValue } from '../datePickerValue';
import { DateField } from './dateField';
import { DateRenderMode } from './dateRenderMode';
import { ActivityDayRequiredDateValidationRule } from '../../services/activity/validators/dateValidators/activityDayRequiredDateValidationRule';
import { ActivityMonthRequiredDateValidationRule } from '../../services/activity/validators/dateValidators/activityMonthRequiredDateValidationRule';
import { ActivityYearRequiredDateValidationRule } from '../../services/activity/validators/dateValidators/activityYearRequiredDateValidationRule';

export class ActivityDateQuestionBlock extends ActivityQuestionBlock<DatePickerValue> {
    public renderMode: DateRenderMode;
    public fields: Array<DateField>;
    public displayCalendar: boolean;
    public useMonthNames: boolean | undefined;
    public startYear: number | undefined;
    public endYear: number | undefined;
    public firstSelectedYear: number | undefined;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Date;
    }

    public isSpecifiedFieldsPresent(value: DatePickerValue): boolean {
        for (const field of this.fields) {
            if ((field === DateField.Year && value.year == null) ||
                (field === DateField.Month && value.month == null) ||
                (field === DateField.Day && value.day == null)) {
                return false;
            }
        }
        return true;
    }

    public hasRequiredFields(value: DatePickerValue): boolean {
        let hasFieldRule = false;
        for (const validator of this.validators) {
            if (validator instanceof ActivityDayRequiredDateValidationRule) {
                hasFieldRule = true;
                if (value.day === null) {
                    return false;
                }
            } else if (validator instanceof ActivityMonthRequiredDateValidationRule) {
                hasFieldRule = true;
                if (value.month === null) {
                    return false;
                }
            } else if (validator instanceof ActivityYearRequiredDateValidationRule) {
                hasFieldRule = true;
                if (value.year === null) {
                    return false;
                }
            }
        }
        // There are field rules and date has value for those rules, so return true.
        return hasFieldRule;
    }
}
