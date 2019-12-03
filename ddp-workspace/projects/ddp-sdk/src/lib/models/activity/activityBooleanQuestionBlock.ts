import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityBooleanQuestionBlock extends ActivityQuestionBlock<boolean> {
    public trueContent: string;
    public falseContent: string;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Boolean;
    }
}
