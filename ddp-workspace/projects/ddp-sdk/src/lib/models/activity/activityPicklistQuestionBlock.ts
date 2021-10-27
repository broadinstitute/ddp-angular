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

    public convertToString(value: ActivityPicklistAnswerDto[]): string {
        return value
            // to make sure generated strings will be the same for the same answers with selected values in the different order
            .sort((a, b) => (a.stableId > b.stableId) ? 1 : -1)
            .map(answer => `${answer.stableId}${answer.detail ? ':' + answer.detail : ''}`).join(';');
    }

    public hasRequiredAnswer(): boolean {
        return this.answer?.length > 0;
    }
}
