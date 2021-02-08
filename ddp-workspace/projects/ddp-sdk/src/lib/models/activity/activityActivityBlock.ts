import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';

enum ChildActivityRendering {
    Embedded = 'embedded',
    Modal = 'modal'
}

export class ActivityActivityBlock extends ActivityBlock {
    public title: string;
    public renderHint: ChildActivityRendering;
    public activityCode: string;
    public allowMultiple: boolean;
    public addButtonText: string;
    public instances: any[];

    public get blockType(): BlockType {
        return BlockType.Activity;
    }
}
