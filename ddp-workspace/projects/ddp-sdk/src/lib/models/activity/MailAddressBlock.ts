import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';

export class MailAddressBlock extends ActivityBlock {
    public displayNumber: number | null;
    public titleText: string | null;
    public subtitleText: string | null;
    public requireVerified: boolean;
    public requirePhone: boolean;
    public hasValidAddress: boolean;
    public addressGuid: string;

    constructor(displayNumber: number) {
        super();
        this.displayNumber = displayNumber;
    }

    public get blockType(): BlockType {
        return BlockType.MailAddress;
    }

    get blocks(): Array<ActivityBlock> {
        return [this];
    }

    protected validateInternally(): boolean {
        if (this.requireVerified) {
            return this.hasValidAddress;
        }

        return true;
    }
}
