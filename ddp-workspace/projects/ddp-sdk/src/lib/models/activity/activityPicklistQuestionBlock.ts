import { ActivityPicklistNormalizedGroup } from './activityPicklistNormalizedGroup';
import { ActivityQuestionBlock } from './activityQuestionBlock';
import { QuestionType } from './questionType';
import { ActivityPicklistAnswerDto } from './activityPicklistAnswerDto';
import { ActivityPicklistOption } from './activityPicklistOption';

export class ActivityPicklistQuestionBlock extends ActivityQuestionBlock<Array<ActivityPicklistAnswerDto>> {
    public picklistOptions: Array<ActivityPicklistOption>;
    public picklistLabel: string;
    public selectMode: string;
    public renderMode: string;
    public detailMaxLength: number;
    public picklistGroups: Array<ActivityPicklistNormalizedGroup>;
    public customValue: string | null;

    constructor() {
        super();
    }

    public get questionType(): QuestionType {
        return QuestionType.Picklist;
    }

    public isUniqueValues(values: ActivityPicklistAnswerDto[][]): boolean {
        const stringValues = values.map(valueArray => valueArray.map(answer => answer.detail || answer.stableId).sort().join());

        return (new Set(stringValues)).size === stringValues.length;
    }
}
