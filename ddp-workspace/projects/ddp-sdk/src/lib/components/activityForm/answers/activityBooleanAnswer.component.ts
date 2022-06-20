import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityBooleanQuestionBlock } from '../../../models/activity/activityBooleanQuestionBlock';
import { BooleanRenderMode } from '../../../models/activity/booleanRenderMode';
import { LayoutType } from '../../../models/layout/layoutType';

@Component({
    selector: 'ddp-activity-boolean-answer',
    template: `
        <ddp-question-prompt [block]="block" *ngIf="!isGridLayout()"></ddp-question-prompt>
        <ng-container *ngIf="block.renderMode === RENDER_MODE.CHECKBOX; then checkbox else defaultRadio"></ng-container>
        <ng-template #defaultRadio>
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
        </ng-template>
        <ng-template #checkbox>
            <mat-checkbox
                [checked]="block.answer"
                [disabled]="readonly"
                [disableRipple]="true"
                (change)="saveValue($event.checked)"
            >
            </mat-checkbox>
        </ng-template>
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
export class ActivityBooleanAnswer {
    public readonly RENDER_MODE = BooleanRenderMode;

    @Input() block: ActivityBooleanQuestionBlock;
    @Input() readonly: boolean;
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();

    public saveValue(value: boolean): void {
        this.block.answer = value;
        this.valueChanged.emit(value);
    }

    public isGridLayout(): boolean {
        return this.layoutType === LayoutType.GRID;
    }
}
