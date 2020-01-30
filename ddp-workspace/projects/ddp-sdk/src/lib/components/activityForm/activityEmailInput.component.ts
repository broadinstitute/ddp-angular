import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivityTextQuestionBlock } from '../../models/activity/activityTextQuestionBlock';
import { distinctUntilChanged, map, skip, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { InstantErrorStateMatcher } from '../../utility/ui/instantErrorStateMatcher';

// Need to hold off on this expression for now until https://broadinstitute.atlassian.net/browse/DDP-4311 is fixed
// const EMAIL_REGEXP =
// tslint:disable-next-line:max-line-length
// /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// Expression being used in server to test email format
export const EMAIL_REGEXP = /^\S+@\S+\.\S+$/;

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
                           [errorStateMatcher]="errorStateMatcher"
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
    // enable confirm input field to start showing errors without being touched first
    public errorStateMatcher = new InstantErrorStateMatcher();

    constructor(private formBuilder: FormBuilder) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'block') {
                this.initEmailForm();
            }
            if (propName === 'readonly') {
                // the emitEvent: false option important! Otherwise emailForm.valueChanges emits a value!
                this.readonly ? this.emailForm.disable({emitEvent: false}) : this.emailForm.enable({emitEvent: false});
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
                    value: this.block.answer,
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
            // first time is just initialization
            skip(1),
            // it's either valid email or a null
            map((cleanedFormData) => this.emailForm.valid && cleanedFormData.email ? cleanedFormData.email : null),
            distinctUntilChanged(),
            tap((val) => this.block.setAnswer(val, false)),
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
