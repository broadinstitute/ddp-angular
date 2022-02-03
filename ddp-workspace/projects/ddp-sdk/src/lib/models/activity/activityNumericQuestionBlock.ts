import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export interface DecimalAnswer {
    value: number;
    scale: number;
}
export type NumericAnswerType = number | DecimalAnswer;

export class ActivityNumericQuestionBlock extends ActivityQuestionBlock<NumericAnswerType> {
    public min: number | null = null;
    public max: number | null = null;
    public precision: number; // for decimal answers - the maximum number of allowed significant digits
    public scale: number; // for decimal answers - the maximum number of allowed decimal digits
    public hideLeadingZero: boolean; // for decimal answers - if we need to hide the leading zero if value is in the range `1 < 0 < -1`

    constructor(private isDecimal: boolean = false) {
        super();
    }

    public get questionType(): QuestionType {
        return this.isDecimal ? QuestionType.Decimal : QuestionType.Numeric;
    }

    public hasAnswer(): boolean {
        return this.answer != null;
    }
}
