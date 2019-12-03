import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityRegexValidationRule extends ActivityAbstractValidationRule {
    constructor(question: ActivityQuestionBlock<string>, public regexPattern: string) {
        super(question);
    }

    public recalculate(): boolean {
        if (this.question.answer !== null) {
            let matchResult: RegExpMatchArray | null = this.question.answer.match(this.regexPattern);
            if (matchResult == null || matchResult[0] !== this.question.answer) {
                this.result = this.message;
                return false;
            }
        }
        this.result = null;
        return true;
    }
}
