import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { DecimalAnswer } from './decimalAnswer';

export class ActivityDecimalQuestionBlock extends ActivityQuestionBlock<DecimalAnswer> {
    public min: DecimalAnswer | null = null;
    public max: DecimalAnswer | null = null;
    public scale = 0; // for decimal answers - the maximum number of allowed decimal digits. Default value = 0

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Decimal;
    }

    public hasAnswer(): boolean {
        // TODO: tweak it for `REQUIRED` validation rule
        return this.answer != null;
    }
}
