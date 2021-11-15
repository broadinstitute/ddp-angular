import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ActivitySection } from '../../models/activity/activitySection';
import { ActivityBlock } from '../../models/activity/activityBlock';
import { BlockType } from '../../models/activity/blockType';
import { ActivityContentBlock } from '../../models/activity/activityContentBlock';
import { ActivityGroupBlock } from '../../models/activity/activityGroupBlock';
import { ActivityInstitutionBlock } from '../../models/activity/activityInstitutionBlock';
import { AbstractActivityQuestionBlock } from '../../models/activity/abstractActivityQuestionBlock';
import { BlockVisibility } from '../../models/activity/blockVisibility';
import { ConditionalBlock } from '../../models/activity/conditionalBlock';
import { ConfigurationService } from '../../services/configuration.service';
import { ActivityActivityBlock } from '../../models/activity/activityActivityBlock';
import { SubmissionManager } from '../../services/serviceAgents/submissionManager.service';
import { ActivityInstance } from '../../models/activityInstance';

@Component({
    selector: 'ddp-activity-section',
    templateUrl: './activitySection.component.html'
})
export class ActivitySectionComponent implements OnInit, OnDestroy {
    @Input() public section: ActivitySection;
    @Input() public readonly: boolean;
    @Input() public validationRequested = false;
    @Input() public studyGuid: string;
    @Input() public activityGuid: string;
    @Output() embeddedComponentsValidationStatus: EventEmitter<boolean> = new EventEmitter();
    @Output() componentBusy: EventEmitter<boolean> = new EventEmitter(true);
    private subscription: Subscription;
    private embeddedValidationStatus = new Map();

    // Block guids and instance guids are generated separately,
    // there is a small possibility that they can have the same ids.
    // Prepended an unique `idPrefix` as to prevent a case with the same blockId & instanceId.
    readonly idPrefix = {
        block: 'b-',
        instance: 'i-'
    };

    constructor(@Inject('ddp.config') public config: ConfigurationService,
                private submissionManager: SubmissionManager,
                private readonly cdr: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.subscription = this.submissionManager.answerSubmissionResponse$.subscribe(response =>
            this.updateVisibilityAndValidation(response.blockVisibility)
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public onBlockVisibilityChanged(blockVisibility: BlockVisibility[]): void {
        this.updateVisibilityAndValidation(blockVisibility);
    }

    public updateVisibilityAndValidation(visibility: BlockVisibility[]): void {
        let blockVisibilityChanged = false;
        visibility.forEach(element => {
            this.section.allChildBlocks().forEach(block => {
                if (block.id === element.blockGuid) {
                    if (block.shown !== element.shown) {
                        block.shown = element.shown;
                        blockVisibilityChanged = true;
                    }
                    if (block.enabled !== element.enabled) {
                        block.enabled = element.enabled;
                    }
                    if (block.blockType === BlockType.Activity && !block.shown) {
                        this.updateValidationForHiddenEmbeddedActivity(block as ActivityActivityBlock);
                    }
                }
            });
        });
        if (blockVisibilityChanged) {
            this.cdr.detectChanges();
        }
    }

    public updateValidationStatusInSection(id: string, isValid: boolean): void {
        this.embeddedValidationStatus.set(id, isValid);
        const reducedValidationStatus = Array.from(this.embeddedValidationStatus.values()).every(value => value);
        this.embeddedComponentsValidationStatus.next(reducedValidationStatus);
    }

    public isContent(block: ActivityBlock): block is ActivityContentBlock {
        // BlockType import stripped by compiler if used directly in template
        return block.blockType === BlockType.Content && block.shown;
    }

    public isGroup(block: ActivityBlock): block is ActivityGroupBlock {
        return block.blockType === BlockType.Group && block.shown;
    }

    public isQuestion(block: ActivityBlock): block is AbstractActivityQuestionBlock {
        return block.blockType === BlockType.Question && block.shown;
    }

    public isInstitution(block: ActivityBlock): block is ActivityInstitutionBlock {
        return block.blockType === BlockType.Institution && block.shown;
    }

    public isMailAddress(block: ActivityBlock): block is ActivityInstitutionBlock {
        return block.blockType === BlockType.MailAddress && block.shown;
    }

    public isConditional(block: ActivityBlock): block is ConditionalBlock {
        return block.blockType === BlockType.Conditional && block.shown;
    }

    public isActivityBlock(block: ActivityBlock): block is ActivityActivityBlock {
        return block.blockType === BlockType.Activity && block.shown;
    }

    private updateValidationForHiddenEmbeddedActivity(block: ActivityActivityBlock): void {
        block.instances.forEach((instance: ActivityInstance) => {
            this.updateValidationStatusInSection(this.idPrefix.instance + instance.instanceGuid, true);
        });
    }
}
