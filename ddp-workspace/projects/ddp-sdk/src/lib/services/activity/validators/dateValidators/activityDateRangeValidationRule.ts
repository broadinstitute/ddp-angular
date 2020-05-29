import { ActivityAbstractValidationRule } from '../activityAbstractValidationRule';
import { ActivityDateQuestionBlock } from '../../../../models/activity/activityDateQuestionBlock';
import { ActivityQuestionBlock } from '../../../../models/activity/activityQuestionBlock';
import { DatePickerValue } from '../../../../models/datePickerValue';

export class ActivityDateRangeValidationRule extends ActivityAbstractValidationRule {
    constructor(
        question: ActivityQuestionBlock<DatePickerValue>,
        public startDate: Date | null = null,
        public endDate: Date | null = null) {
        super(question);
    }

    public recalculate(): boolean {
        if (this.question.answer != null) {
            const dateQuestion = this.question as ActivityDateQuestionBlock;
            const value = this.question.answer as DatePickerValue;
            if (dateQuestion.isSpecifiedFieldsPresent(value) || dateQuestion.hasRequiredFields(value)) {
                const valid = this.isWithinRange(this.question.answer);
                this.result = (valid ? null : this.message);
                return valid;
            }
        }
        this.result = null;
        return true;
    }

    private isWithinRange(value: DatePickerValue): boolean {
        const [startYear, startMonth, startDay] = (this.startDate == null ? [null, null, null]
            : [this.startDate.getFullYear(), this.startDate.getMonth() + 1, this.startDate.getDate()]);
        const [endYear, endMonth, endDay] = (this.endDate == null ? [null, null, null]
            : [this.endDate.getFullYear(), this.endDate.getMonth() + 1, this.endDate.getDate()]);
        if (this.isFullDate(value)) {
            return this.isFullDateWithinRange(value);
        } else if (this.isYearMonth(value)) {
            return this.isFieldsWithinRange(startYear, startMonth,
                                            value.year as number, value.month as number,
                                            endYear, endMonth);
        } else if (this.isMonthDay(value)) {
            return this.isFieldsWithinRange(startMonth, startDay,
                                            value.month as number, value.day as number,
                                            endMonth, endDay);
        } else if (this.isYearDay(value)) {
            return this.isFieldsWithinRange(startYear, startDay,
                                            value.year as number, value.day as number,
                                            endYear, endDay);
        } else if (value.year != null) {
            return this.isFieldWithinRange(startYear, value.year, endYear);
        } else if (value.month != null) {
            return this.isFieldWithinRange(startMonth, value.month, endMonth);
        } else if (value.day != null) {
            return this.isFieldWithinRange(startDay, value.day, endDay);
        } else {
            return true;
        }
    }

    private isFullDate(value: DatePickerValue): boolean {
        return value.year != null && value.month != null && value.day != null;
    }

    private isYearMonth(value: DatePickerValue): boolean {
        return value.year != null && value.month != null && value.day == null;
    }

    private isMonthDay(value: DatePickerValue): boolean {
        return value.year == null && value.month != null && value.day != null;
    }

    private isYearDay(value: DatePickerValue): boolean {
        return value.year != null && value.month == null && value.day != null;
    }

    private isFullDateWithinRange(value: DatePickerValue): boolean {
        const valueDate = new Date(value.year as number, (value.month as number) - 1, value.day as number);
        valueDate.setFullYear(value.year as number);
        return (this.startDate == null || this.isLessOrEqual(this.startDate, valueDate)) &&
                (this.endDate == null || this.isLessOrEqual(valueDate, this.endDate));
    }

    private isFieldsWithinRange(start: number | null, subStart: number | null,
                                field: number, subField: number,
                                end: number | null, subEnd: number | null): boolean {
        // Assumes that subStart is present when start is non-null, same for subEnd.
        return (start == null || this.isFieldsLessOrEqual(start, subStart as number, field, subField)) &&
                (end == null || this.isFieldsLessOrEqual(field, subField, end, subEnd as number));
    }

    private isFieldWithinRange(start: number | null, field: number, end: number | null): boolean {
        return (start == null || start <= field) && (end == null || field <= end);
    }

    private isFieldsLessOrEqual(field1: number, subfield1: number, field2: number, subfield2: number): boolean {
        return (field1 < field2) || (field1 === field2 && subfield1 <= subfield2);
    }

    private isLessOrEqual(d1: Date, d2: Date): boolean {
        return d1.getTime() <= d2.getTime();
    }
}
