import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityBooleanQuestionBlock } from '../../../../../models/activity/activityBooleanQuestionBlock';

@Component({
    selector: 'ddp-activity-boolean-checkbox-answer',
    template: `
        {{ block.answer }}
        <mat-checkbox
            [checked]="block.answer"
            [disabled]="readonly"
            [disableRipple]="true"
            (change)="onValueChange()"
        >
            <p
                [innerHTML]="
                    block.answer ? block.trueContent : block.falseContent
                "
            ></p>
        </mat-checkbox>
    `,
    styles: [
        `
            :host ::ng-deep .mat-checkbox-inner-container {
                margin: 2px 8px 0 0;
            }
        `,
    ],
})
export class ActivityBooleanCheckboxAnswerComponent{
    @Input() block: ActivityBooleanQuestionBlock;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    toggleAnswer(): void {
        this.block.answer = !this.block.answer;
    }

    onValueChange(): void {
        this.toggleAnswer();
        this.valueChanged.emit(this.block.answer);
    }
}
