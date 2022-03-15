import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { PicklistSelectMode } from './../../../models/activity/picklistSelectMode';
import { PicklistRenderMode } from './../../../models/activity/picklistRenderMode';

@Component({
    selector: 'ddp-activity-picklist-answer',
    template: `
    <ddp-question-prompt [block]="block"></ddp-question-prompt>
    <div>
        <ddp-activity-radiobuttons-picklist-question
            *ngIf="block.selectMode === SELECT_MODE.SINGLE && block.renderMode === RENDER_MODE.LIST"
            [block]="block"
            [readonly]="readonly"
            (valueChanged)="valueChanged.emit($event)">
        </ddp-activity-radiobuttons-picklist-question>
        <ddp-activity-checkboxes-picklist-question
            *ngIf="block.selectMode === SELECT_MODE.MULTIPLE && block.renderMode === RENDER_MODE.LIST || block.renderMode === RENDER_MODE.CHECKBOX_LIST"
            [block]="block"
            [readonly]="readonly"
            (valueChanged)="valueChanged.emit($event)">
        </ddp-activity-checkboxes-picklist-question>
        <ddp-activity-dropdown-picklist-question
            *ngIf="block.renderMode === RENDER_MODE.DROPDOWN"
            [block]="block"
            [readonly]="readonly"
            (valueChanged)="valueChanged.emit($event)">
        </ddp-activity-dropdown-picklist-question>
        <ddp-activity-autocomplete-picklist-question
            *ngIf="block.renderMode === RENDER_MODE.AUTOCOMPLETE"
            [block]="block"
            [readonly]="readonly"
            (valueChanged)="valueChanged.emit($event)">
        </ddp-activity-autocomplete-picklist-question>
        <ddp-activity-picklist-remote-auto-complete-options
                *ngIf="block.renderMode === RENDER_MODE.REMOTE_AUTOCOMPLETE"
                [block]="block"
                [readonly]="readonly"
                [studyGuid]="studyGuid"
                [activityGuid]="activityGuid"
                (valueChanged)="valueChanged.emit($event)"
            >
            </ddp-activity-picklist-remote-auto-complete-options>
    </div>`
})
export class ActivityPicklistAnswer {
    @Input() block: ActivityPicklistQuestionBlock;
    @Input() readonly: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;

    @Output() valueChanged: EventEmitter<Array<ActivityPicklistAnswerDto>> = new EventEmitter();

    public readonly SELECT_MODE = PicklistSelectMode;
    public readonly RENDER_MODE = PicklistRenderMode;
}
