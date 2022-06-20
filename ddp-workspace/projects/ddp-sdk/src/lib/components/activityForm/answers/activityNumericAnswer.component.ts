import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ActivityNumericQuestionBlock } from '../../../models/activity/activityNumericQuestionBlock';
import { QuestionType } from '../../../models/activity/questionType';
import { ActivityDecimalQuestionBlock } from '../../../models/activity/activityDecimalQuestionBlock';
import { ActivityQuestionBlock } from '../../../models/activity/activityQuestionBlock';
import { NumericAnswerType } from '../../../models/activity/numericAnswerType';
import { DecimalAnswer } from '../../../models/activity/decimalAnswer';
import { AbstractActivityQuestionBlock } from '../../../models/activity/abstractActivityQuestionBlock';
import { DecimalHelper } from '../../../utility/decimalHelper';
import { InputRestriction } from '../../../models/InputRestriction';
import { LayoutType } from '../../../models/layout/layoutType';

@Component({
    selector: 'ddp-activity-numeric-answer',
    template: `
    <ddp-question-prompt [block]="block" *ngIf="!isGridLayout()"></ddp-question-prompt>
    <mat-form-field  class="input-field" [floatLabel]="block.label ? 'always' : null">
        <mat-label *ngIf="block.label" [innerHTML]="block.label"></mat-label>
        <input matInput
               type="number"
               [appInputRestriction]="isIntegerQuestion ? InputRestriction.Integer : ''"
               [formControl]="numericField"
               [min]="block.min"
               [max]="block.max"
               autocomplete="off"
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
    @Input() block: ActivityNumericQuestionBlock | ActivityDecimalQuestionBlock;
    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    @Output() valueChanged: EventEmitter<NumericAnswerType> = new EventEmitter();
    public numericField: FormControl;
    InputRestriction = InputRestriction;
    private subs: Subscription;

    public ngOnInit(): void {
        this.initForm();

        this.subs = this.numericField.valueChanges.subscribe((enteredValue: number) => {
            const answerToDisplay: string = this.mapAnswerToDisplay(enteredValue);
            const answerToPatch: NumericAnswerType = this.mapAnswerToPatchToServer(answerToDisplay);

            this.numericField.patchValue(answerToDisplay, {onlySelf: true, emitEvent: false});
            (this.block as ActivityQuestionBlock<NumericAnswerType>).answer = answerToPatch;
            this.valueChanged.emit(answerToPatch);
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

    public get valueChangeStep(): number {
        return this.isDecimalQuestion(this.block) ? Math.pow(10, -((this.block as ActivityDecimalQuestionBlock).scale)) : 1;
    }

    get isIntegerQuestion(): boolean {
        return this.block.questionType === QuestionType.Numeric; // otherwise Question.Decimal
    }

    public isGridLayout(): boolean {
        return this.layoutType === LayoutType.GRID;
    }

    private initForm(): void {
        this.numericField = new FormControl({
            value: this.mapAnswerToDisplay(this.block.answer),
            disabled: this.readonly
        }, {updateOn: 'blur'});
    }

    // e.g. for decimal: 0.71 => '0.710' (scale = 3)
    private mapAnswerToDisplay(patchAnswer: NumericAnswerType | null): string {
        if (patchAnswer == null) {
            return '';
        }

        return this.isIntegerQuestion ?
            patchAnswer.toString() :
            DecimalHelper.formatDecimalAnswer(patchAnswer, (this.block as ActivityDecimalQuestionBlock).scale,false);
    }

    // e.g. for decimal: '0.710' => {  // a decimal floating-point value represented by (value * 10^-scale)
    //   "value": 710,  // the significand of a decimal number
    //   "scale": 3     // the exponent of a decimal number
    // }
    private mapAnswerToPatchToServer(answerValue: string): NumericAnswerType | null {
        if (answerValue === null || answerValue === '') {
            return null;
        }

        return this.isIntegerQuestion ?
            parseInt(answerValue, 10) :
            this.formatDecimalAnswer(answerValue);
    }

    private formatDecimalAnswer(answerValue: string): DecimalAnswer {
        const [integerPart = '', decimalPart = ''] = answerValue.split('.');
        return {
            value: +integerPart.concat(decimalPart),
            scale: decimalPart.length
        };
    }

    private isDecimalQuestion(block: AbstractActivityQuestionBlock): boolean {
        return block.questionType === QuestionType.Decimal;
    }
}
