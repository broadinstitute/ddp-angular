import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { DecimalAnswer } from './decimalAnswer';
import { DecimalHelper } from '../../utility/decimalHelper';

export class ActivityDecimalQuestionBlock extends ActivityQuestionBlock<DecimalAnswer> {
    public min: number | null = null;
    public max: number | null = null;
    public scale = 0; // for decimal answers - the maximum number of allowed decimal digits. Default value = 0

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Decimal;
    }

    public hasAnswer(): boolean {
        return DecimalHelper.isDecimalAnswerType(this.answer);
    }
}
