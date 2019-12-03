import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { ActivityNumericQuestionBlock } from '../../models/activity/activityNumericQuestionBlock';
import * as _ from 'underscore';

@Component({
    selector: 'ddp-activity-numeric-answer',
    template: `
    <ddp-question-prompt [block]="block"></ddp-question-prompt>
    <mat-form-field  class="input-field" [floatLabel]="block.label ? 'always' : null">
        <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>
        <input matInput
               type="number"
               [formControl]="numericField"
               [min]="block.min"
               [max]="block.max"
               [placeholder]="placeholder || block.placeholder"
               [attr.data-ddp-test]="'answer:' + block.stableId"
               (blur)="onBlur($event.target.value)">
    </mat-form-field>
    `,
    styles: [`
        .input-field {
            width: 100%;
        }
    `]
})
export class ActivityNumericAnswer implements OnChanges {
    @Input() block: ActivityNumericQuestionBlock;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<number> = new EventEmitter();
    public numericField: FormControl;

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'block') {
                const numericValidators = [];
                if (_.isNumber(this.block.min)) {
                    numericValidators.push(Validators.min(this.block.min));
                }
                if (_.isNumber(this.block.max)) {
                    numericValidators.push(Validators.max(this.block.max));
                }
                this.numericField = new FormControl({
                    value: _.isNumber(this.block.answer) ? this.block.answer : '',
                    disabled: this.readonly
                }, numericValidators);
            }
            if (propName === 'readonly') {
                this.readonly ? this.numericField.disable() : this.numericField.enable();
            }
        }
    }

    public onBlur(value: string): void {
        const answer = parseInt(value, 10);
        if (isNaN(answer)) {
            this.numericField.setValue('');
            this.emitAnswer(null);
        } else if (this.numericField.invalid) {
            this.emitAnswer(null);
        } else {
            this.numericField.setValue(answer);
            this.emitAnswer(answer);
        }
    }

    private emitAnswer(value: number | null): void {
        this.block.answer = value;
        this.valueChanged.emit(value);
    }
}
