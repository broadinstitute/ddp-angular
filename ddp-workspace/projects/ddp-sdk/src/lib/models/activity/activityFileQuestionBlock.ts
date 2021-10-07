import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { ActivityFileAnswerDto } from './activityFileAnswerDto';

export class ActivityFileQuestionBlock extends ActivityQuestionBlock<ActivityFileAnswerDto> {
    public maxFileSize: number;
    public mimeTypes: string[];

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.File;
    }
}
