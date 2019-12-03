import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';

export class ActivityAgreementQuestionBlock extends ActivityQuestionBlock<boolean> {
    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Agreement;
    }

    public canPatch(): boolean {
        return true;
    }
}
