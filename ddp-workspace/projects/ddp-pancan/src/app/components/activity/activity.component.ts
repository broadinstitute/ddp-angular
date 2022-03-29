import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Injector, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
    ActivityRedesignedComponent,
    SubmissionManager,
    SubmitAnnouncementService,
    ActivitySection,
    ActivityActivityBlock,
    ActivityRenderHintType,
    LoggingService,
    WindowRef,
    AnalyticsEventsService,
    ParticipantsSearchServiceAgent
} from 'ddp-sdk';
import { Subscription } from 'rxjs';

type Block = ActivitySection['blocks'][number]

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent implements OnInit, OnDestroy {
    dialogsClosedSubscription: Subscription;

    constructor(
        public editDialog: MatDialog,
        logger: LoggingService,
        windowRef: WindowRef,
        changeRef: ChangeDetectorRef,
        renderer: Renderer2,
        submitService: SubmitAnnouncementService,
        analytics: AnalyticsEventsService,
        participantsSearch: ParticipantsSearchServiceAgent,
        @Inject(DOCUMENT) document: any,
        injector: Injector
    ) {
        super(logger, windowRef, changeRef, renderer, submitService, analytics, participantsSearch, document, injector);
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.dialogsClosedSubscription = this.editDialog.afterAllClosed.subscribe(() => {
            this.showEmptyNestedActivityError = !this.hasNoEmptyNestedActivity;
            setTimeout(() => this.showEmptyNestedActivityError = !this.hasNoEmptyNestedActivity, 200); // quick and dirty solution to re-check, in case activity was deleted a bit later
        });
    }

    public ngOnDestroy(): void {
        this.dialogsClosedSubscription.unsubscribe();
    }

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
        try {
            const enabledActivityBlocks = this.currentSection.blocks.filter(this.isActiveModalActivityBlock) as ActivityActivityBlock[];

            return enabledActivityBlocks.every(this.blockHasAnswers);
        } catch {
            return true;
        }
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
