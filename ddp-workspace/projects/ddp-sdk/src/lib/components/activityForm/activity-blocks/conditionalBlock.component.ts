import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnswerValue } from '../../../models/activity/answerValue';
import { ConditionalBlock } from '../../../models/activity/conditionalBlock';

@Component({
    selector: 'ddp-conditional-block',
    template: `
    <ddp-activity-question [block]="block.controlQuestion"
                            [readonly]="readonly"
                            [validationRequested]="validationRequested"
                            [studyGuid]="studyGuid"
                            [activityGuid]="activityGuid"
                            (valueChanged)="handleChange($event)">
    </ddp-activity-question>
    <ddp-group-block [block]="block.nestedGroupBlock"
                        [readonly]="readonly"
                        [validationRequested]="validationRequested"
                        [studyGuid]="studyGuid"
                        [activityGuid]="activityGuid"
                        (valueChanged)="handleChange($event)">
    </ddp-group-block>`
})
export class ConditionalBlockComponent {
    @Input() block: ConditionalBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();

    public handleChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
    }
}
