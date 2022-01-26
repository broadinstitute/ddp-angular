import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivityNumericQuestionBlock } from '../../../models/activity/activityNumericQuestionBlock';
import { NumericType } from '../../../models/activity/numericType';

interface DecimalAnswer {
    value: number;
    scale: number;
}

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
               [step]="valueChangeStep"
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
    @Input() valueChangeStep: number;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Output() valueChanged: EventEmitter<number> = new EventEmitter();
    public numericField: FormControl;
    private subs: Subscription;

    public ngOnInit(): void {
        console.log('question:', this.block);

        this.initForm();

        this.subs = this.numericField.valueChanges.subscribe((enteredValue: number) => {
            const answerToDisplay: string = this.mapAnswerToDisplay(enteredValue);
            const answerToPatch: number | DecimalAnswer = this.mapAnswerToPatchToServer(answerToDisplay);

            this.numericField.patchValue(answerToDisplay, {onlySelf: true, emitEvent: false});
            this.block.answer = answerToPatch as any;
            this.valueChanged.emit(answerToPatch as any);
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
            value: this.mapAnswerToDisplay(this.block.answer),
            disabled: this.readonly
        }, {updateOn: 'blur'});
    }

    private get isIntegerQuestion(): boolean {
        return this.block.numericType === NumericType.Integer;
    }

    // e.g. .71 => '0.710' (scale = 3)
    private mapAnswerToDisplay(patchAnswer: number | null): string {
        if (patchAnswer == null) {
            return '';
        }

        return this.isIntegerQuestion ?
            patchAnswer.toString() :
            this.formatDecimalAnswerToDisplay(patchAnswer);
    }

    // e.g. '0.710' => {  // a decimal floating-point value represented by (value * 10^-scale)
    //   "value": 710,  // the significand of a decimal number
    //   "scale": 3     // the exponent of a decimal number
    // }
    private mapAnswerToPatchToServer(answerValue: string): number | DecimalAnswer | null {
        if (answerValue === null) {
            return null;
        }

        return this.isIntegerQuestion ?
            parseInt(answerValue, 10) :
            this.formatDecimalAnswer(answerValue);
    }

    private formatDecimalAnswer(answerValue: string): DecimalAnswer {
        const [integerPart = '', decimalPart = ''] = answerValue.split('.');
        const res = {
            value: +integerPart.concat(decimalPart),
            scale: decimalPart.length
        };
        console.log('Decimal to patch:', res);
        return res;
    }

    private formatDecimalAnswerToDisplay(enteredValue: number): string {
        const precise: number = this.block.precision;
        const scale: number = this.block.scale;
        const hideLeadingZero: boolean = this.block.hideLeadingZero || false;

        let [
            integerPart = hideLeadingZero ? '' : '0',
            decimalPart = '0'.repeat(scale)
        ] = String(enteredValue).split('.');

        if (precise && !!Number(integerPart)) {
            integerPart = integerPart.slice(0, precise);
        }

        if (decimalPart.length < scale) {
            decimalPart += '0'.repeat(scale - decimalPart.length);
        }
        const res = (`${integerPart}.${decimalPart.slice(0, scale)}`);

        console.log('Decimal to display:', res);
        return res;
    }

}
