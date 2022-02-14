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
    public scale: number; // for decimal answers - the maximum number of allowed decimal digits

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
