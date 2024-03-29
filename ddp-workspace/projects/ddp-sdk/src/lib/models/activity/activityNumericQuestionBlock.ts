import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityNumericQuestionBlock extends ActivityQuestionBlock<number> {
    public min: number | null = null;
    public max: number | null = null;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Numeric;
    }

    public hasAnswer(): boolean {
        return this.answer != null;
    }
}
