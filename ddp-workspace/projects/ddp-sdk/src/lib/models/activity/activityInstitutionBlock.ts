import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';

export class ActivityInstitutionBlock extends ActivityBlock {
    public allowMultiple: boolean | null;
    public addButtonText: string | null;
    public titleText: string | null;
    public subtitleText: string | null;
    public institutionType: string;
    public showFieldsInitially: boolean;
    public displayNumber: number | null;

    public get blockType(): BlockType {
        return BlockType.Institution;
    }

    public validate(): boolean {
        return true;
    }

    public shouldScrollToFirstInvalidQuestion(): boolean {
        return false;
    }
}
