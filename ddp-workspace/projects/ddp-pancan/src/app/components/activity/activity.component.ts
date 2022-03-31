import { Component } from '@angular/core';

import {
    ActivityRedesignedComponent,
    SubmissionManager,
    SubmitAnnouncementService,
    ActivitySection,
    ActivityActivityBlock,
    ActivityRenderHintType
} from 'ddp-sdk';

type Block = ActivitySection['blocks'][number]

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
    showEmptyNestedActivityError = false;

    public incrementStep(): void {
        if (this.hasNoEmptyNestedActivity) {
            this.showEmptyNestedActivityError = false;
            super.incrementStep();
        } else {
            this.showEmptyNestedActivityError = true;
        }
    }

    get hasNoEmptyNestedActivity(): boolean {
        const enabledActivityBlocks = this.currentSection.blocks.filter(this.isActiveModalActivityBlock) as ActivityActivityBlock[];

        return enabledActivityBlocks.every(this.blockHasAnswers);
    }

    private isActiveModalActivityBlock = (block: ActivityActivityBlock): boolean =>
        this.isActivityBlock(block) ? block.enabled && block.renderHint === ActivityRenderHintType.Modal : false;

    private isActivityBlock(block: Block): block is ActivityActivityBlock {
        return 'activityCode' in block && typeof block.activityCode === 'string';
    }

    private blockHasAnswers(block: ActivityActivityBlock): boolean {
        const noUnansweredInstance = block.instances.every(inst => inst.numQuestionsAnswered > 0);

        return noUnansweredInstance;
    }
}
