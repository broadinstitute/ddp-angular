import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';
import { ListStyleHint } from './listStyleHint';

export class ActivityGroupBlock extends ActivityBlock {
    public title: string | null;
    public listStyle: ListStyleHint;
    public body: string;
    public content: string | null;
    public nestedBlocks: ActivityBlock[];

    public get blockType(): BlockType {
        return BlockType.Group;
    }

    public validate(): boolean {
        let isValid = true;
        for (const nestedBlock of this.nestedBlocks) {
            if (nestedBlock.shown) {
                isValid = isValid && nestedBlock.validate();
            }
        }
        this.valid = isValid;
        return isValid;
    }

    public shouldScrollToFirstInvalidQuestion(): boolean {
        for (const nestedBlock of this.nestedBlocks) {
            if (nestedBlock.shouldScrollToFirstInvalidQuestion()) {
                return true;
            }
        }
        return false;
    }
}
