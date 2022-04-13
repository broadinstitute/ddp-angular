import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { BooleanRenderMode } from './booleanRenderMode';


export class ActivityBooleanQuestionBlock extends ActivityQuestionBlock<boolean> {
    public trueContent: string;
    public falseContent: string;
    public renderMode: BooleanRenderMode;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Boolean;
    }

    public hasAnswer(): boolean {
        return this.answer != null
    }
}
