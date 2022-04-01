import { ActivitySectionIcon } from './activitySectionIcon';
import { ActivityBlockType } from './activityBlockType';

export class ActivitySection {
    public name: string;
    public icons: ActivitySectionIcon[];
    public blocks: Array<ActivityBlockType> = [];
    public valid: boolean;
    public visible: boolean;

    public get incompleteIcon(): string {
        return this.getIcon('INCOMPLETE');
    }

    // recursively return all the child blocks contained in section
    public allChildBlocks(): Array<ActivityBlockType> {
        return this.blocks.reduce((acc, val) => acc.concat(val.blocks), []);
    }

    public get completeIcon(): string {
        return this.getIcon('COMPLETE');
    }

    public validate(): boolean {
        let isValid = true;
        for (const block of this.blocks) {
            isValid = block.validate() && isValid;
        }
        this.valid = isValid;
        return isValid;
    }

    public shouldScrollToFirstInvalidQuestion(): boolean {
        for (const block of this.blocks) {
            if (block.shouldScrollToFirstInvalidQuestion()) {
                return true;
            }
        }
        return false;
    }

    public recalculateVisibility(): boolean {
        this.visible = !this.blocks.every(block => block.shown === false);
        return this.visible;
    }

    private getIcon(state: string): string {
        const iconDescription = this.icons.find(x => x.state === state);
        let icon = '';
        if (iconDescription) {
            icon = iconDescription.icon;
        } else if (this.icons.length > 0) {
            icon = this.icons[0].icon;
        }
        return icon;
    }
}
