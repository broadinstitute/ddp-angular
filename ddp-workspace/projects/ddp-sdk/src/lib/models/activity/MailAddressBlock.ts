import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';

export class MailAddressBlock extends ActivityBlock {
    public displayNumber: number | null;
    public titleText: string | null;
    public subtitleText: string | null;
    public requireVerified: boolean;
    public requirePhone: boolean;

    constructor(displayNumber: number) {
        super();
        this.displayNumber = displayNumber;
    }

    public get blockType(): BlockType {
        return BlockType.MailAddress;
    }

    public validate(): boolean {
        return true;
    }

    public shouldScrollToFirstInvalidQuestion(): boolean {
        return false;
    }
}
