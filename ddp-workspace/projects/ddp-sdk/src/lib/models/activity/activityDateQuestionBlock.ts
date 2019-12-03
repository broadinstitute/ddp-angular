import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { DatePickerValue } from '../datePickerValue';
import { DateField } from './dateField';
import { DateRenderMode } from './dateRenderMode';

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
}
