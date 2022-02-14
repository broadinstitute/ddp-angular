import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export interface DecimalAnswer {
    value: number;
    scale: number;
}
export type NumericAnswerType = number | DecimalAnswer;

export class ActivityDecimalQuestionBlock extends ActivityQuestionBlock<DecimalAnswer> {
    public min: DecimalAnswer | null = null;
    public max: DecimalAnswer | null = null;
    public scale = 2; // for decimal answers - the maximum number of allowed decimal digits. Default value = 2

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
