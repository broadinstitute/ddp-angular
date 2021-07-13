import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { ActivityAbstractValidationRule } from './activityAbstractValidationRule';

export class ActivityStrictMatchValidationRule extends ActivityAbstractValidationRule {
    constructor(private block: ActivityPicklistQuestionBlock) {
        super(block);
    }

    public recalculate(): boolean {
        const validationResult = !this.block.answer?.length || !!this.block.answer[0].stableId;
        this.result = validationResult ? null : { message: 'SDK.Validators.Autocomplete', params: { control: this.block.question } };

        return validationResult;
    }
}
