import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { DecimalAnswer } from './decimalAnswer';

export class ActivityEquationQuestionBlock extends ActivityQuestionBlock<DecimalAnswer[]> {
    public maximumDecimalPlaces: number;
    // if the equation is a composite question child, keep row index in order to future update the equation value
    public compositeRowIndex = 0;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Equation;
    }

    public hasAnswer(): boolean {
        // no need to validate because equation question is read-only
        return true;
    }
}
