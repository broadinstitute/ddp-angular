import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { QuestionType } from '../../../models/activity/questionType';
import { ActivityCompositeQuestionBlock } from 'ddp-sdk';

export class ActivityUniqueValidationRule extends ActivityAbstractValidationRule {
    constructor(question: ActivityQuestionBlock<any>) {
        super(question);
    }

    public recalculate(): boolean {
        const {answer: answers} = this.question;
        if (this.question.questionType !== QuestionType.Composite || answers.length <= 1) {
            this.result = null;
            return true;
        }

        const [firstChild] = (this.question as ActivityCompositeQuestionBlock).children;
        this.result = this.message;
        return firstChild.isUniqueValues(answers.map(value => value[0].value));
    }
}
