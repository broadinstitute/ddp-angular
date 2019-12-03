import { BlockType } from './blockType';

export abstract class ActivityBlock {
    public id: string;
    public shown: boolean;
    public scrollTo = false;
    public valid = true;

    abstract get blockType(): BlockType;

    public shouldScrollToFirstInvalidQuestion(): boolean {
        if (this.shown) {
            this.valid ? this.scrollTo = false : this.scrollTo = true;
        }
        return this.scrollTo;
    }

    public validate(): boolean {
        const result = this.validateInternally();
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
