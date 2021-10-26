import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityDateQuestionBlock } from '../../../models/activity/activityDateQuestionBlock';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { DatePickerValue } from '../../../models/datePickerValue';
import { QuestionType } from '../../../models/activity/questionType';
import { ActivityFileAnswerDto } from '../../../models/activity/activityFileAnswerDto';

export class ActivityRequiredValidationRule extends ActivityAbstractValidationRule {
    public isRequired: boolean;

    constructor(question: ActivityQuestionBlock<any>, isRequired: boolean = true) {
        super(question);
        this.isRequired = isRequired;
    }

    public recalculate(): boolean {
        if (!this.isRequired) {
            this.result = null;
            return true;
        }

        let valid = true;

        if (this.question.answer == null) {
            valid = false;
        } else if (this.question.questionType === QuestionType.Agreement) {
            valid = (this.question.answer === true);
        } else if (this.question.questionType === QuestionType.Date) {
            const dateQuestion = this.question as ActivityDateQuestionBlock;
            const value = this.question.answer as DatePickerValue;
            valid = dateQuestion.isSpecifiedFieldsPresent(value);
        } else if (this.question.questionType === QuestionType.Picklist) {
            const value = this.question.answer as Array<ActivityPicklistAnswerDto>;
            valid = value.length > 0;
        } else if (this.question.questionType === QuestionType.Composite) {
            const answers = this.question.answer as Array<any>;
            valid = answers?.length && answers.flatMap(x => x).every(answer => answer.value);
        } else if (this.question.questionType === QuestionType.Text) {
            const value = this.question.answer as string;
            valid = value.trim().length > 0;
        } else if (this.question.questionType === QuestionType.File) {
            const value = this.question.answer as ActivityFileAnswerDto;
            valid = value && !!value.fileName && (value.fileSize != null);
        }

        this.result = (valid ? null : this.message);
        return valid;
    }
}
