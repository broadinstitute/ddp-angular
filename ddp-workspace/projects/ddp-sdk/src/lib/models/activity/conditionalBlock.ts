import { ActivityBlock } from './activityBlock';
import { BlockType } from './blockType';
import { ActivityQuestionBlock } from './activityQuestionBlock';
import { ActivityGroupBlock } from './activityGroupBlock';

export class ConditionalBlock extends ActivityBlock {
    public controlQuestion: ActivityQuestionBlock<any> | null;
    public nestedGroupBlock: ActivityGroupBlock;
    public displayNumber: number | null;

    public get blockType(): BlockType {
        return BlockType.Conditional;
    }

    public get blocks(): Array<ActivityBlock> {
        return [this as ActivityBlock]
            .concat(this.controlQuestion.blocks as ActivityBlock[])
            .concat(this.nestedGroupBlock.blocks as ActivityBlock[]);
    }

    public validate(): boolean {
        let isValid = true;
        if (this.controlQuestion && this.controlQuestion.shown) {
            isValid = this.controlQuestion.validate();
        }
        if (this.nestedGroupBlock.shown) {
            isValid = this.nestedGroupBlock.validate() && isValid;
        }
        this.valid = isValid;
        return isValid;
    }

    public shouldScrollToFirstInvalidQuestion(): boolean {
        if (this.controlQuestion) {
            if (this.controlQuestion.shouldScrollToFirstInvalidQuestion()) {
                return true;
            }
        }
        if (this.nestedGroupBlock.shouldScrollToFirstInvalidQuestion()) {
            return true;
        }
        return false;
    }
}
