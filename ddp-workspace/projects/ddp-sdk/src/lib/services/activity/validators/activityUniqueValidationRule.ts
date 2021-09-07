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

        const {children} = (this.question as ActivityCompositeQuestionBlock);

        const compositeAnswersStrings: string[] = answers.map(values => {
            let result = '';
            for (const [i, value] of values.entries()) {
                const block = children[i];
                // can't calculate a file's uniqueness
                if (block.questionType !== QuestionType.File) {
                    result += value.value ? `${value.stableId}:${children[i].convertToString(value.value)};` : '';
                }
            }
            return result;
        });

        // all composite answers are empty
        if (compositeAnswersStrings.every(str => !str)) {
            return true;
        }

        this.result = this.message;
        return (new Set(compositeAnswersStrings)).size === compositeAnswersStrings.length;
    }
}
