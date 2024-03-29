import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityGroupBlock } from '../../../models/activity/activityGroupBlock';
import { AnswerValue } from '../../../models/activity/answerValue';
import { ListStyleHint } from '../../../models/activity/listStyleHint';
import { BlockType } from '../../../models/activity/blockType';

@Component({
    selector: 'ddp-group-block-list',
    template: `

    <ng-container *ngIf="listStyle === LIST_STYLE.NONE; then flatList else itemedList">
    </ng-container>

    <ng-template #flatList>
        <ng-container *ngFor="let block of blocks">
            <div *ngIf="block.blockType === BLOCK_TYPE.Content"
                class="ddp-li"
                [ngClass]="{'ddp-li-bullet': listStyle === LIST_STYLE.BULLET}">
                <ng-container *ngTemplateOutlet="content; context: {block: block}">
                </ng-container>
            </div>
            <div *ngIf="block.blockType === BLOCK_TYPE.Question"
                class="ddp-question"
                [ngClass]="{'ddp-question-neutral': listStyle === LIST_STYLE.BULLET,
                            'ddp-group-block-list': listStyle !== LIST_STYLE.BULLET,
                            'ddp-hide-block': !block.shown}">
                <ng-container *ngTemplateOutlet="question; context: {block: block}">
                </ng-container>
            </div>
        </ng-container>
    </ng-template>

    <ng-template #itemedList>
        <ng-container *ngFor="let block of blocks">
            <li *ngIf="block.blockType === BLOCK_TYPE.Content"
                class="ddp-li"
                [ngClass]="{'ddp-li-bullet': listStyle === LIST_STYLE.BULLET}">
                <ng-container *ngTemplateOutlet="content; context: {block: block}">
                </ng-container>
            </li>
            <li *ngIf="block.blockType === BLOCK_TYPE.Question"
                class="ddp-question"
                [ngClass]="{'ddp-question-neutral': listStyle === LIST_STYLE.BULLET,
                            'ddp-group-block-list': listStyle !== LIST_STYLE.BULLET,
                            'ddp-hide-block': !block.shown}">
                <ng-container *ngTemplateOutlet="question; context: {block: block}">
                </ng-container>
            </li>
        </ng-container>
    </ng-template>

    <ng-template #content let-block="block">
        <ng-container *ngIf="block.shown">
            <span *ngIf="block.title" class="ddp-block-title-bold"
                  [innerHTML]="block.title">
            </span>
            <div class="ddp-block-body"
                 [innerHTML]="block.content">
            </div>
        </ng-container>
    </ng-template>

    <ng-template #question let-block="block">
        <ddp-activity-question [block]="block"
                               [readonly]="readonly"
                               [validationRequested]="validationRequested"
                               [studyGuid]="studyGuid"
                               [activityGuid]="activityGuid"
                               (valueChanged)="handleChange($event)">
        </ddp-activity-question>
    </ng-template>`
})
export class GroupBlockList {
    @Input() blocks: Array<ActivityGroupBlock>;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Input() listStyle: string;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();

    public readonly LIST_STYLE = ListStyleHint;
    public readonly BLOCK_TYPE = BlockType;

    public handleChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
    }
}
