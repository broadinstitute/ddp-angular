import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { QuestionType } from '../../../models/activity/questionType';
import {
    ActivityCompositeQuestionBlock,
    AnswerContainer
} from '../../../models/activity/activityCompositeQuestionBlock';

export class ActivityUniqueValidationRule extends ActivityAbstractValidationRule {
    constructor(question: ActivityQuestionBlock<any>) {
        super(question);
    }

    public recalculate(): boolean {
        this.result = null;
        const answers: AnswerContainer[][] = this.question.answer;
        if (this.question.questionType !== QuestionType.Composite || answers.length <= 1) {
            return true;
        }

        const childQuestionBlocks = (this.question as ActivityCompositeQuestionBlock).children;

        const compositeAnswersStrings: string[] = answers.map(values => {
            let result = '';
            for (const [i, value] of values.entries()) {
                const block = childQuestionBlocks[i];
                // can't calculate a file's uniqueness
                if (block.questionType === QuestionType.File) {
                    continue;
                }

                result += value.value ? `${value.stableId}:${childQuestionBlocks[i].convertToString(value.value)};` : '';
            }
            return result;
        });

        // all composite answers are empty
        if (compositeAnswersStrings.every(str => !str)) {
            return true;
        }

        const valid = (new Set(compositeAnswersStrings)).size === compositeAnswersStrings.length;
        this.result = valid ? null : this.message;
        return valid;
    }
}
