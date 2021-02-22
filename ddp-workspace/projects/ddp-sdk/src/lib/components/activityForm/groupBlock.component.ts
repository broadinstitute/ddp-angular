import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnswerValue } from './../../models/activity/answerValue';
import { ActivityGroupBlock } from '../../models/activity/activityGroupBlock';
import { ListStyleHint } from '../../models/activity/listStyleHint';

@Component({
    selector: 'ddp-group-block',
    template: `
    <div *ngIf="block.title"
          [ngClass]="{'ddp-block-title-color': block.listStyle == LIST_STYLE.BULLET}"
          [innerHTML]="block.title">
    </div>
    <!-- todo arz pass through question blocks -->
    <!-- todo factor out type lookups like isCOntent() to separate class -->
    <ng-template #blockList>
        <ddp-group-block-list [blocks]="block.nestedBlocks"
                              [readonly]="readonly"
                              [validationRequested]="validationRequested"
                              [studyGuid]="studyGuid"
                              [activityGuid]="activityGuid"
                              [listStyle]="block.listStyle"
                              (valueChanged)="handleChange($event)">
        </ddp-group-block-list>
    </ng-template>

    <ng-container [ngSwitch]="block.listStyle">
        <div *ngSwitchCase="LIST_STYLE.NONE" class="ddp-list ddp-group-block"
            [ngClass]="{'ddp-simple-list': block.listStyle == LIST_STYLE.NONE}">
            <ng-container *ngTemplateOutlet="blockList"></ng-container>
        </div>

        <ul *ngSwitchCase="LIST_STYLE.BULLET" class="ddp-list">
            <ng-container *ngTemplateOutlet="blockList"></ng-container>
        </ul>

        <ol *ngSwitchDefault class="ddp-list"
            [ngClass]="{'ddp-list-inside': block.listStyle == LIST_STYLE.UPPER_ALPHA}"
            [attr.type]="block.listStyle == LIST_STYLE.UPPER_ALPHA ? 'A' : null">
                <ng-container *ngTemplateOutlet="blockList"></ng-container>
        </ol>
    </ng-container>`
})
export class GroupBlock {
    @Input() block: ActivityGroupBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();

    public readonly LIST_STYLE = ListStyleHint;

    public handleChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
    }
}
