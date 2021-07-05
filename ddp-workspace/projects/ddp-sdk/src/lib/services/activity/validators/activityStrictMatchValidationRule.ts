import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityStrictMatchValidationRule extends ActivityAbstractValidationRule {
    constructor(private block: ActivityPicklistQuestionBlock) {
        super(block);
    }

    public recalculate(): boolean {
        const allowCustomValue = !!this.block.picklistOptions.find(option => option.allowDetails);
        const strictMatch = !!(allowCustomValue || !this.block.answer
            || this.block.picklistSuggestions
                .find(suggestion => suggestion.value.toLowerCase() === this.block.answer[0].stableId.toLowerCase()));

        this.result = strictMatch ? null : 'SDK.Validators.Autocomplete';

        return strictMatch;
    }
}
