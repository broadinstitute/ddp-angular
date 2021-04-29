import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityFileQuestionBlock extends ActivityQuestionBlock<boolean> {
    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.File;
    }
}
