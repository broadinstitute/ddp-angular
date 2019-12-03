import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityDateQuestionBlock } from '../../../models/activity/activityDateQuestionBlock';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DatePickerValue } from '../../../models/datePickerValue';
import { QuestionType } from '../../../models/activity/questionType';

/**
 * Validator to check "completeness" of answers.
 */
export class ActivityCompleteValidationRule extends ActivityAbstractValidationRule {

    constructor(question: ActivityQuestionBlock<any>) {
        super(question);
    }

    public recalculate(): boolean {
        let valid = true;

        if (this.question.answer != null) {
            if (this.question.questionType === QuestionType.Date) {
                // "completeness" for date means value is either blank or all fields are present.
                const dateQuestion = this.question as ActivityDateQuestionBlock;
                const value = this.question.answer as DatePickerValue;
                if (this.isBlank(value)) {
                    valid = true;
                } else {
                    valid = dateQuestion.isSpecifiedFieldsPresent(value);
                }
            }
        }

        this.result = (valid ? null : this.message);
        return valid;
    }

    private isBlank(value: DatePickerValue): boolean {
        return value.year == null && value.month == null && value.day == null;
    }
}
