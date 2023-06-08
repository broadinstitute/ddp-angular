import {ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';

import {ActivitySection} from '../../models/activity/activitySection';
import {ActivityBlock} from '../../models/activity/activityBlock';
import {BlockType} from '../../models/activity/blockType';
import {BlockVisibility} from '../../models/activity/blockVisibility';
import {ConfigurationService} from '../../services/configuration.service';
import {ActivityActivityBlock} from '../../models/activity/activityActivityBlock';
import {SubmissionManager} from '../../services/serviceAgents/submissionManager.service';
import {ActivityInstance} from '../../models/activityInstance';

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
    @Input() public activityCode: string;
    @Input() public activityStatusCode: string;

    @Output() embeddedComponentsValidationStatus: EventEmitter<boolean> = new EventEmitter();
    @Output() componentBusy: EventEmitter<boolean> = new EventEmitter(true);

    private subscription: Subscription;
    private embeddedValidationStatus = new Map();

    readonly BlockType = BlockType;
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

    public updateValidationStatusInSection(id: string, isValid: boolean): void {
        this.embeddedValidationStatus.set(id, isValid);
        const reducedValidationStatus = Array.from(this.embeddedValidationStatus.values()).every(value => value);
        this.embeddedComponentsValidationStatus.next(reducedValidationStatus);
    }

    public shouldBlockBeShown(block: ActivityBlock, type: BlockType): boolean {
        return block.blockType === type && block.shown;
    }

    private updateVisibilityAndValidation(visibility: BlockVisibility[]): void {
        let blockStateChanged = false;
        visibility.forEach(element => {
            this.section.allChildBlocks().forEach(block => {
                if (block.id === element.blockGuid) {
                    if (block.shown !== element.shown) {
                        block.shown = element.shown;
                        blockStateChanged = true;
                    }
                    if (block.enabled !== element.enabled) {
                        block.enabled = element.enabled;
                        blockStateChanged = true;
                    }
                    if (block.blockType === BlockType.Activity && !block.shown) {
                        this.updateValidationForHiddenEmbeddedActivity(block as ActivityActivityBlock);
                    }
                }
            });
        });
        if (blockStateChanged) {
            this.cdr.detectChanges();
        }
    }

    private updateValidationForHiddenEmbeddedActivity(block: ActivityActivityBlock): void {
        block.instances.forEach((instance: ActivityInstance) => {
            this.updateValidationStatusInSection(this.idPrefix.instance + instance.instanceGuid, true);
        });
    }
}
