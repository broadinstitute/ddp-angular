import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityBooleanQuestionBlock } from '../../../../models/activity/activityBooleanQuestionBlock';
import { BooleanRenderMode } from '../../../../models/activity/booleanRenderMode';

@Component({
    selector: 'ddp-activity-boolean-answer',
    template: `
        <ddp-question-prompt [block]="block"></ddp-question-prompt>
        <ddp-activity-boolean-radio-buttons-answer
            *ngIf="block.renderMode === RENDER_MODE.RADIO_BUTTONS"
            [block]="block"
            [readonly]="readonly"
            (valueChanged)="valueChanged.emit($event)"
        >
        </ddp-activity-boolean-radio-buttons-answer>
        <ddp-activity-boolean-checkbox-answer
            *ngIf="block.renderMode === RENDER_MODE.CHECKBOX"
            [block]="block"
            [readonly]="readonly"
            (valueChanged)="valueChanged.emit($event)"
        >
        </ddp-activity-boolean-checkbox-answer>
    `,
    styles: [],
})
export class ActivityBooleanAnswer {
    public readonly RENDER_MODE = BooleanRenderMode;

    @Input() block: ActivityBooleanQuestionBlock;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();

    public saveValue(value: boolean): void {
        this.valueChanged.emit(value);
    }
}
