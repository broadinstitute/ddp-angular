import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';

@Component({
    selector: 'ddp-activity-email-input',
    template: `
    <form [formGroup]="emailForm" class="email-input">
        <mat-form-field>
            <input matInput
                   type="email"
                   formControlName="email"
                   class="email-input-field"
                   [minlength]="block.minLength"
                   [maxlength]="block.maxLength"
                   [placeholder]="placeholder || block.placeholder"
                   [attr.data-ddp-test]="'answer:' + block.stableId"
                   (change)="onChange($event.target.value)">
            <mat-error *ngIf="fieldHasError('email', 'email')" translate>SDK.EmailEntry.InvalidEmail</mat-error>
        </mat-form-field>
        <ng-container *ngIf="block.confirmEntry">
            <p class="ddp-question-prompt" [ngClass]="{'ddp-required-question-prompt': this.block.isRequired}" [innerHTML]="block.confirmPrompt"></p>
            <mat-form-field>
                <input matInput
                       type="email"
                       formControlName="confirmEmail"
                       class="email-inpu-field"
                       [minlength]="block.minLength"
                       [maxlength]="block.maxLength"
                       [placeholder]="placeholder || block.placeholder"
                       [attr.data-ddp-test]="'answer:' + block.stableId"
                       (change)="onChange($event.target.value)">
                <mat-error *ngIf="fieldHasError('confirmEmail', 'email')" translate>SDK.EmailEntry.InvalidEmail</mat-error>
                <mat-error *ngIf="fieldHasError('confirmEmail', 'mustMatch')">{{block.mismatchMessage}}</mat-error>
            </mat-form-field>
        </ng-container>
    </form>
    `,
    styles: [`
        .email-input {
            display: flex;
            flex-direction: column;
        }
        .email-input-field {
            width: 100%;
        }
    `]
})
export class ActivityEmailInput implements OnChanges {
    @Input() block: ActivityTextQuestionBlock;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
    public emailForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'block') {
                this.initEmailForm();
            }
            if (propName === 'readonly') {
                this.readonly ? this.emailForm.disable() : this.emailForm.enable();
            }
        }
    }

    public onChange(answer: string): void {
        const allFieldsTouched = Object.values(this.emailForm.controls).every(control => control.touched);
        if (this.emailForm.valid) {
            this.saveAnswer(answer);
        } else if (allFieldsTouched) {
            this.saveAnswer(null);
        }
    }

    public fieldHasError(field: string, error: string): boolean {
        return this.emailForm.touched && this.emailForm.controls[field].errors && this.emailForm.controls[field].errors[error];
    }

    private initEmailForm(): void {
        if (this.block.confirmEntry) {
            this.emailForm = this.formBuilder.group({
                email: new FormControl({
                    value: this.block.answer,
                    disabled: this.readonly
                }, Validators.email),
                confirmEmail: new FormControl({
                    value: this.block.answer,
                    disabled: this.readonly
                }, Validators.email)
            }, {
                validator: fieldsMatcher('email', 'confirmEmail')
            });
        } else {
            this.emailForm = new FormGroup({
                email: new FormControl({
                    value: this.block.answer,
                    disabled: this.readonly
                }, Validators.email)
            });
        }
    }

    private saveAnswer(answer: string | null): void {
        this.block.answer = answer;
        this.valueChanged.emit(answer);
    }
}

function fieldsMatcher(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // Return if another validator has already found an error on the matchingControl
            return;
        }
        // Set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
