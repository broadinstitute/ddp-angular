import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';
import { ActivityQuestionBlock } from './activityQuestionBlock';

export class ActivityTabularBlock extends ActivityBlock {
    title: string;
    content: ActivityQuestionBlock<any>[][];
    headers: any[];
    numberOfColumns = 1;

    get blockType(): BlockType {
        return BlockType.Tabular;
    }

    get blocks(): ActivityBlock[] {
        return [this];
             // TODO: fix the response
            //.concat(this.content.flatMap(row => row.map(question => question.block)));
    }
}
