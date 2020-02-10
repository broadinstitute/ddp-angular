import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';
import { ActivityAbstractValidationRule } from '../../services/activity/validators/activityAbstractValidationRule';
import { ActivityInstitutionInfo } from './activityInstitutionInfo';

export class ActivityInstitutionBlock extends ActivityBlock {
    public allowMultiple: boolean | null;
    public addButtonText: string | null;
    public titleText: string | null;
    public subtitleText: string | null;
    public institutionType: string;
    public showFieldsInitially: boolean;
    public displayNumber: number | null;
    public required: boolean;
    public answers: Array<ActivityInstitutionInfo> = [];
    public validators: Array<ActivityAbstractValidationRule> = [];

    public get blockType(): BlockType {
        return BlockType.Institution;
    }

    protected validateInternally(): boolean {
        let result = true;
        if (this.required && this.shown) {
            for (const validator of this.validators) {
                result = result && validator.recalculate();
            }
        }
        return result;
    }
}
