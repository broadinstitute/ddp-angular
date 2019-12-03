import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';

export class ActivityContentBlock extends ActivityBlock {
    public content: string;
    public title: string | null = null;
    public displayNumber: number | null;

    public get blockType(): BlockType {
        return BlockType.Content;
    }

    public validate(): boolean {
        return true;
    }

    public shouldScrollToFirstInvalidQuestion(): boolean {
        return false;
    }
}
