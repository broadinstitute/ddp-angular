import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, Injector, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {
    ActivityRedesignedComponent,
    SubmissionManager,
    SubmitAnnouncementService,
    ActivityActivityBlock,
    ActivityRenderHintType,
    LoggingService,
    WindowRef,
    AnalyticsEventsService,
    ParticipantsSearchServiceAgent,
    ActivityActionsAgent,
    ActivityBlockType,
} from 'ddp-sdk';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html',
    providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent implements OnInit, OnDestroy {
    showEmptyNestedActivityError = false;
    dialogsClosedSubscription: Subscription;
    activityInstanceDeletedSubscription: Subscription;

    constructor(
        private editDialog: MatDialog,
        private activityActionsAgent: ActivityActionsAgent,
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

        this.dialogsClosedSubscription = this.editDialog.afterAllClosed.subscribe(this.updateErrorMessageDisplayState);

        this.activityInstanceDeletedSubscription =
            this.activityActionsAgent.activityBlockInstancesUpdated.subscribe(this.updateErrorMessageDisplayState);
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        this.dialogsClosedSubscription.unsubscribe();
        this.activityInstanceDeletedSubscription.unsubscribe();
    }

    public updateErrorMessageDisplayState = (): void => {
        this.showEmptyNestedActivityError = !this.allNestedActivitiesHaveAnswers;
    };

    public incrementStep(): void {
        if (this.allNestedActivitiesHaveAnswers) {
            this.showEmptyNestedActivityError = false;
            super.incrementStep();
        } else {
            this.showEmptyNestedActivityError = true;
        }
    }

    get allNestedActivitiesHaveAnswers(): boolean {
        const enabledActivityBlocks = this.currentSection.blocks.filter(this.isActiveModalActivityBlock) as ActivityActivityBlock[];

        return enabledActivityBlocks.every(this.blockHasAnswers);
    }

    private isActiveModalActivityBlock = (block: ActivityBlockType): boolean =>
        this.isActivityBlock(block) ? block.enabled && block.renderHint === ActivityRenderHintType.Modal : false;

    private isActivityBlock(block: ActivityBlockType): block is ActivityActivityBlock {
        return 'activityCode' in block && typeof block.activityCode === 'string';
    }

    private blockHasAnswers(block: ActivityActivityBlock): boolean {
        const noUnansweredInstance = block.instances.every(inst => inst.numQuestionsAnswered > 0);

        return noUnansweredInstance;
    }
}
