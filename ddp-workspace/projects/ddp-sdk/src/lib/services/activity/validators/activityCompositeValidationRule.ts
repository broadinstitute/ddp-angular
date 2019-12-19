import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { AnswerContainer } from '../../../models/activity/activityCompositeQuestionBlock';

export class ActivityCompositeValidationRule extends ActivityAbstractValidationRule {
    constructor(compositeQuestionBlock: ActivityQuestionBlock<any>) {
        super(compositeQuestionBlock);
    }

    get compositeQuestion() {
        return this.question as any;
    }

    recalculate(): boolean {
        let answer: AnswerContainer[][] = this.compositeQuestion.answer;
        if (answer == null || answer.length === 0) {
            answer = [];
            answer.push(this.compositeQuestion.children.map((child) => ({ stableId: child.stableId, value: null })));
        }
        return this.compositeQuestion.children
            .every((childQuestionBlock, colIdx) => childQuestionBlock
                .validators.every(
                    (validator) => {
                        validator.question = this.compositeQuestion.children[colIdx];
                        return answer.every((row) => {
                            validator.question.setAnswer(row[colIdx] != null ? row[colIdx].value : null, false);
                            if (validator.recalculate()) {
                                this.result = null;
                                return true;
                            } else {
                                this.result = validator.result;
                                return false;
                            }
                        });
                    }
                ));
    }
}
