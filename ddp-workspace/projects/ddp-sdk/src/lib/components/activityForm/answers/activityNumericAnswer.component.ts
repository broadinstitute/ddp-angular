import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivityNumericQuestionBlock } from '../../../models/activity/activityNumericQuestionBlock';
import * as _ from 'underscore';
import { Subscription } from 'rxjs';

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
               [attr.data-ddp-test]="'answer:' + block.stableId">
    </mat-form-field>
    `,
    styles: [`
        .input-field {
            width: 100%;
        }
    `]
})
export class ActivityNumericAnswer implements OnInit, OnChanges, OnDestroy {
    @Input() block: ActivityNumericQuestionBlock;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<number> = new EventEmitter();
    public numericField: FormControl;
    private subs: Subscription;

    public ngOnInit(): void {
        this.initForm();
        this.subs = this.numericField.valueChanges.subscribe(enteredValue => {
            const answer = enteredValue !== null ? parseInt(enteredValue, 10) : null;
            this.block.answer = answer;
            this.numericField.patchValue(answer === null ? '' : answer, {onlySelf: true, emitEvent: false});
            this.valueChanged.emit(answer);
        });
    }

    ngOnDestroy(): void {
        this.subs?.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName of Object.keys(changes)) {
            if (propName === 'block' && !changes['block'].firstChange) {
                this.initForm();
            }
            if (propName === 'readonly' && !changes['readonly'].firstChange) {
                this.readonly ? this.numericField.disable({ emitEvent: false }) : this.numericField.enable({ emitEvent: false });
            }
        }
    }

    private initForm(): void {
        this.numericField = new FormControl({
            value: _.isNumber(this.block.answer) ? this.block.answer : '',
            disabled: this.readonly
        }, {updateOn: 'blur'});
    }
}
