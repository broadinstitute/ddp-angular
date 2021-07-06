import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityStrictMatchValidationRule extends ActivityAbstractValidationRule {
    constructor(private block: ActivityPicklistQuestionBlock) {
        super(block);
    }

    public recalculate(): boolean {
        const noNeedCheckAnswer = this.block.customValue || !this.block.answer;
        const validationResult = !!(noNeedCheckAnswer || (this.block.answer[0].stableId && this.block.picklistSuggestions
                .find(suggestion => suggestion.value.toLowerCase() === this.block.answer[0].stableId.toLowerCase())));

        this.result = validationResult ? null : { message: 'SDK.Validators.Autocomplete', params: { control: this.block.question } };

        return validationResult;
    }
}
