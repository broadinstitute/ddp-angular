import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { QuestionType } from '../../../models/activity/questionType';
import { ActivityCompositeQuestionBlock, ActivityPicklistQuestionBlock } from 'ddp-sdk';
import { PicklistSelectMode } from '../../../models/activity/picklistSelectMode';

export class ActivityUniqueValidationRule extends ActivityAbstractValidationRule {
    constructor(question: ActivityQuestionBlock<any>) {
        super(question);
    }

    public recalculate(): boolean {
        const {answer: answers} = this.question;
        if (this.question.questionType !== QuestionType.Composite || answers.length === 1) {
            this.result = null;
            return true;
        }

        const [firstChild] = (this.question as ActivityCompositeQuestionBlock).children;

        if (firstChild.questionType !== QuestionType.Picklist
            || (firstChild as ActivityPicklistQuestionBlock).selectMode !== PicklistSelectMode.SINGLE) {
            this.result = null;
            return true;
        }

        const { customValue } = firstChild as ActivityPicklistQuestionBlock;
        const answersIds = answers.map(([{value}]) => value[0].stableId === customValue
            ? value[0].detail
            : value[0].stableId);
        this.result = this.message;
        return (new Set(answersIds)).size === answersIds.length;
    }
}
