import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { ChildOrientation } from './childOrientation';
import { ActivityCompositeValidationRule } from '../../services/activity/validators/activityCompositeValidationRule';

export interface AnswerContainer {
    stableId: string;
    value: any;
}

export class ActivityCompositeQuestionBlock extends ActivityQuestionBlock<AnswerContainer[][]> {
    public children: ActivityQuestionBlock<any>[] = [];
    public allowMultiple = false;
    public addButtonText = '';
    public additionalItemText: string | null;
    public childOrientation: ChildOrientation | null = null;

    constructor() {
        super();
        this.validators.push(new ActivityCompositeValidationRule(this));
    }

    public get questionType(): QuestionType {
        return QuestionType.Composite;
    }

    public hasRequiredAnswer(): boolean {
        const requiredChildren = this.children.filter(child => child.isRequired);

        return requiredChildren ?
            requiredChildren.every(childQuestion => childQuestion.hasRequiredAnswer())
            : !!this.answer?.length;
    }
}
