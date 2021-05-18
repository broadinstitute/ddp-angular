import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { ActivityFileAnswerDto } from './activityFileAnswerDto';

export class ActivityFileQuestionBlock extends ActivityQuestionBlock<ActivityFileAnswerDto> {
    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.File;
    }
}
