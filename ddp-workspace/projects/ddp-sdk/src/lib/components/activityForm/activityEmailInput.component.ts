import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { EMAIL_REGEXP } from '../../services/activity/validators/activityEmailValidatorRule';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
                       [attr.data-ddp-test]="'answer:' + block.stableId">
                <mat-error *ngIf="fieldHasError('email', 'pattern')" translate>SDK.EmailEntry.InvalidEmail</mat-error>
            </mat-form-field>
            <ng-container *ngIf="block.confirmEntry">
                <p class="ddp-question-prompt"
                   [ngClass]="{'ddp-required-question-prompt': this.block.isRequired}"
                   [innerHTML]="block.confirmPrompt">
                </p>
                <mat-form-field>
                    <input matInput
                           type="email"
                           formControlName="confirmEmail"
                           class="email-input-field"
                           [minlength]="block.minLength"
                           [maxlength]="block.maxLength"
                           [placeholder]="placeholder || block.placeholder"
                           [attr.data-ddp-test]="'answer:' + block.stableId">
                    <mat-error *ngIf="fieldHasError('confirmEmail', 'pattern')" translate>SDK.EmailEntry.InvalidEmail</mat-error>
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
export class ActivityEmailInput implements OnChanges, OnDestroy {
    @Input() block: ActivityTextQuestionBlock;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Output() valueChanged: EventEmitter<string | null> = new EventEmitter();
    public emailForm: FormGroup;
    private subscription: Subscription;

    constructor(private formBuilder: FormBuilder) {
    }

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

    public fieldHasError(field: string, error: string): boolean {
        return this.emailForm && this.emailForm.touched && this.emailForm.controls[field].errors
            && this.emailForm.controls[field].errors[error];
    }

    private initEmailForm(): void {
        interface EmailForm {
            email: string;
            confirmEmail?: string;
        }
        // can't use the Angular email validator as does not match Pepper back-end email validator
        const EmailPatternValidator = Validators.pattern(EMAIL_REGEXP);

        if (this.block.confirmEntry) {

            this.emailForm = this.formBuilder.group({
                email: new FormControl({
                    value: this.block.answer,
                    disabled: this.readonly
                }, EmailPatternValidator),
                confirmEmail: new FormControl({
                    value: this.block.confirmationValue,
                    disabled: this.readonly
                }, EmailPatternValidator)
            }, {
                validator: this.fieldsMatcher('email', 'confirmEmail')
            });
        } else {
            this.emailForm = new FormGroup({
                email: new FormControl({
                    value: this.block.answer,
                    disabled: this.readonly
                }, EmailPatternValidator)
            });
        }

        this.subscription = this.emailForm.valueChanges.pipe(
            map((formData) => {
                const cleanedFormData: EmailForm = { email: '' };
                ['email', 'confirmEmail'].forEach(propName =>
                    cleanedFormData[propName] = formData[propName] ? formData[propName].trim() : null
                );
                return cleanedFormData;
            }),
            tap((cleanedFormData) => {
                this.block.setAnswer(cleanedFormData.email, false);
                this.block.confirmEntry && (this.block.confirmationValue = cleanedFormData.confirmEmail);
            }),
            // we only emit data we know server will accept
            filter((_) => this.block.canPatch()),
            map((cleanedFormData) => !!cleanedFormData.email ? cleanedFormData.email : ''),
            distinctUntilChanged(),
            tap((val) => this.valueChanged.emit(val))
        ).subscribe();
    }

    private fieldsMatcher(controlName: string, matchingControlName: string): ValidatorFn {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                // Return if another validator has already found an error on the matchingControl
                return null;
            }
            // Set error on matchingControl if validation fails
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
            return matchingControl.errors;
        };
    }

    ngOnDestroy(): void {
        this.subscription && this.subscription.unsubscribe();
    }
}
