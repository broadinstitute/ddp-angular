import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivitySection } from '../../models/activity/activitySection';
import { ActivityBlock } from '../../models/activity/activityBlock';
import { BlockType } from '../../models/activity/blockType';
import { ActivityContentBlock } from '../../models/activity/activityContentBlock';
import { ActivityGroupBlock } from '../../models/activity/activityGroupBlock';
import { ActivityInstitutionBlock } from '../../models/activity/activityInstitutionBlock';
import { AbstractActivityQuestionBlock } from '../../models/activity/abstractActivityQuestionBlock';
import { BlockVisibility } from '../../models/activity/blockVisibility';
import { ConditionalBlock } from '../../models/activity/conditionalBlock';
import { AnswerValue } from './../../models/activity/answerValue';

@Component({
    selector: 'ddp-activity-section',
    template: `
        <div class="margin-bottom" *ngFor="let block of section.blocks">
            <ng-container *ngIf="block.displayNumber; then numbered else notNumbered">
            </ng-container>

            <ng-template #numbered>
                <ol class="ddp-list">
                    <li class="ddp-li" [value]="block.displayNumber">
                        <ng-container *ngTemplateOutlet="content"></ng-container>
                    </li>
                </ol>
            </ng-template>

            <ng-template #notNumbered>
                <div class="ddp-single-question">
                    <ng-container *ngTemplateOutlet="content"></ng-container>
                </div>
            </ng-template>

            <ng-template #content>
                <div *ngIf="isConditional(block)">
                    <ddp-conditional-block [block]="block"
                                           [readonly]="readonly"
                                           [validationRequested]="validationRequested"
                                           [studyGuid]="studyGuid"
                                           (valueChanged)="handleChange($event)"
                                           [activityGuid]="activityGuid">
                    </ddp-conditional-block>
                </div>
                <div *ngIf="isQuestion(block)">
                    <ddp-activity-question [block]="block"
                                           [readonly]="readonly"
                                           [validationRequested]="validationRequested"
                                           [studyGuid]="studyGuid"
                                           [activityGuid]="activityGuid"
                                           (valueChanged)="handleChange($event)"
                                           (visibilityChanged)="updateVisibility($event)">
                    </ddp-activity-question>
                </div>
                <div *ngIf="isInstitution(block)">
                    <ddp-institutions-form [block]="block"
                                           [studyGuid]="studyGuid"
                                           [readonly]="readonly"
                                           (componentBusy)="embeddedComponentBusy.emit($event)">
                    </ddp-institutions-form>
                </div>
                <div *ngIf="isMailAddress(block)">
                    <ddp-address-embedded [block]="block"
                                          [readonly]="readonly"
                                          [activityGuid]="activityGuid"
                                          (validStatusChanged)="embeddedComponentValidStatusChanged.emit($event)"
                                          (componentBusy)="embeddedComponentBusy.emit($event)">
                    </ddp-address-embedded>
                </div>
            </ng-template>

            <div *ngIf="isContent(block)">
                <ddp-activity-content [block]="block"></ddp-activity-content>
            </div>
            <div *ngIf="isGroup(block)">
                <ddp-group-block [block]="block"
                                 [readonly]="readonly"
                                 [validationRequested]="validationRequested"
                                 [studyGuid]="studyGuid"
                                 (valueChanged)="handleChange($event)"
                                 [activityGuid]="activityGuid">
                </ddp-group-block>
            </div>
        </div>`
})
export class ActivitySectionComponent {
    @Input() public section: ActivitySection;
    @Input() public readonly: boolean;
    @Input() public validationRequested = false;
    @Input() public studyGuid: string;
    @Input() public activityGuid: string;
    @Output() visibilityChanged: EventEmitter<BlockVisibility[]> = new EventEmitter();
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    @Output() embeddedComponentValidStatusChanged: EventEmitter<boolean> = new EventEmitter();
    @Output() embeddedComponentBusy: EventEmitter<boolean> = new EventEmitter(true);

    public updateVisibility(visibility: BlockVisibility[]): void {
        this.visibilityChanged.emit(visibility);
    }

    public handleChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
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
}
