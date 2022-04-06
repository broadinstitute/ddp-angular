import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivityBooleanQuestionBlock } from '../../../../../models/activity/activityBooleanQuestionBlock';

@Component({
    selector: 'ddp-activity-boolean-radio-buttons-answer',
    template: `
        <mat-radio-group
            class="example-radio-group"
            [(ngModel)]="block.answer"
            [attr.data-ddp-test]="'answer:' + block.stableId"
            #booleanInput="ngModel"
        >
            <mat-radio-button
                class="primary margin"
                [value]="true"
                [disabled]="readonly"
                [disableRipple]="true"
                (change)="saveValue(true)"
            >
                <div [innerHTML]="block.trueContent"></div>
            </mat-radio-button>
            <mat-radio-button
                class="margin"
                [value]="false"
                [disabled]="readonly"
                [disableRipple]="true"
                (change)="saveValue(false)"
            >
                <div [innerHTML]="block.falseContent"></div>
            </mat-radio-button>
        </mat-radio-group>
    `,
    styles: [
        `
            .margin {
                margin: 15px 30px 15px 0px;
            }
            .example-input-field {
                width: 50%;
            }
        `,
    ],
})
export class ActivityBooleanRadioButtonsAnswerComponent implements OnInit {
    @Input() block: ActivityBooleanQuestionBlock;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();

    constructor() {}

    ngOnInit(): void {}

    public saveValue(value: boolean): void {
        this.block.answer = value;
        this.valueChanged.emit(value);
    }
}
