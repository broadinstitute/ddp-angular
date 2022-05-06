import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { DecimalAnswer } from './decimalAnswer';

export class ActivityEquationQuestionBlock extends ActivityQuestionBlock<DecimalAnswer[]> {
    public maximumDecimalPlaces: number;

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

    // equation answer is read-only, can not be changed on client-side
    public generatesAnswers(): boolean {
        return false;
    }
}
