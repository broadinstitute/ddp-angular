import { ActivityPicklistNormalizedGroup } from './activityPicklistNormalizedGroup';
import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityPicklistOption } from './activityPicklistOption';
import { ActivityPicklistSuggestion } from './activityPicklistSuggestion';

export class ActivityPicklistQuestionBlock extends ActivityQuestionBlock<Array<ActivityPicklistAnswerDto>> {
    public picklistOptions: Array<ActivityPicklistOption>;
    public picklistLabel: string;
    public selectMode: string;
    public renderMode: string;
    public detailMaxLength: number;
    public picklistGroups: Array<ActivityPicklistNormalizedGroup>;
    public picklistSuggestions: Array<ActivityPicklistSuggestion>;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Picklist;
    }
}
