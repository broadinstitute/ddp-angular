import { BlockType } from './blockType';

export abstract class ActivityBlock {
    public id: string;
    public shown: boolean;
    public enabled = true;
    public scrollTo = false;
    public valid = true;

    abstract get blockType(): BlockType;

    /**
     * all block contained by this block, including self
     */
    abstract get blocks(): Array<ActivityBlock>;

    public shouldScrollToFirstInvalidQuestion(): boolean {
        if (this.shown) {
            this.scrollTo = !this.valid;
        }
        return this.scrollTo;
    }

    public validate(): boolean {
        const result = this.enabled ? this.validateInternally() : true;
        this.valid = result;
        return result;
    }

    public canPatch(): boolean {
        return this.validateInternally();
    }

    protected validateInternally(): boolean {
        return true;
    }
}
