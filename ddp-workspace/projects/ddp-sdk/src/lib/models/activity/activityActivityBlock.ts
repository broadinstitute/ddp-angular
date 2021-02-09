import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';
import { ActivityInstance } from '../activityInstance';

enum ActivityRenderHintType {
    Embedded = 'EMBEDDED',
    Modal = 'MODAL'
}

export class ActivityActivityBlock extends ActivityBlock {
    public title: string;
    public renderHint: ActivityRenderHintType;
    public activityCode: string;
    public allowMultiple: boolean;
    public addButtonText: string;
    public instances: ActivityInstance[];

    public get blockType(): BlockType {
        return BlockType.Activity;
    }
}
