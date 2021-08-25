import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { QuestionType } from '../../../models/activity/questionType';

export class ActivityUniqueValidationRule extends ActivityAbstractValidationRule {
    constructor(question: ActivityQuestionBlock<any>) {
        super(question);
    }

    public recalculate(): boolean {
        const {answer: answers} = this.question;
        if (this.question.questionType !== QuestionType.Composite || answers.length === 1) {
            return true;
        }

        // compare only single select picklist questions
        if (answers.find(([{value}]) => !Array.isArray(value) || value.length > 1)) {
            return true;
        }

        const answersIds = answers.map(([{value}]) => value[0].stableId);
        this.result = this.message;
        return (new Set(answersIds)).size === answersIds.length;
    }
}
