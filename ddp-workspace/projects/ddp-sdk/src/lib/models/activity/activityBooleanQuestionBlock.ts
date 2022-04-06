import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityBooleanQuestionBlock extends ActivityQuestionBlock<boolean> {
    public trueContent: string;
    public falseContent: string;
    public renderMode: string;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Boolean;
    }

    public hasAnswer(): boolean {
        return this.answer != null;
    }
}
