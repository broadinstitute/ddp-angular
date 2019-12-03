import { ActivityContentBlock } from './activityContentBlock';
import { ActivityQuestionBlock } from './activityQuestionBlock';
import { ActivityInstitutionBlock } from './activityInstitutionBlock';
import { ActivitySectionIcon } from './activitySectionIcon';

export class ActivitySection {
    public name: string;
    public icons: ActivitySectionIcon[];
    public blocks: Array<ActivityContentBlock | ActivityQuestionBlock<any> | ActivityInstitutionBlock>;
    public valid: boolean;
    public visible: boolean;

    constructor() {
        this.blocks = new Array<ActivityContentBlock | ActivityQuestionBlock<any> | ActivityInstitutionBlock>();
    }

    public get incompleteIcon(): string {
        return this.getIcon('INCOMPLETE');
    }

    public get completeIcon(): string {
        return this.getIcon('COMPLETE');
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
}
