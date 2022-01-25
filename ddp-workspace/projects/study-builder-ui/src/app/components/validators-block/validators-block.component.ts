import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, merge, Observable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { ValidationControlsData, ValidatorsMapper } from './validators.mapper';
import { RuleDef } from '../../model/core/ruleDef';

@Component({
    selector: 'app-validators-block',
    templateUrl: './validators-block.component.html',
    styleUrls: ['./validators-block.component.scss']
})
export class ValidatorsBlockComponent implements OnInit, OnDestroy {
    @Input() set validators(data: RuleDef[]) {
        if (data) {
            this.validatorsDataSubject.next(ValidatorsMapper.mapToValidationControlsData(data));
        }
    }
    @Output() validatorsChanged = new EventEmitter<RuleDef[]>();

    validatorsDataSubject = new BehaviorSubject<ValidationControlsData | null>(null);
    validatorsGroup = this.fb.group({
        REQUIRED: this.fb.group({
            on: [false],
            message: [{value: '', disabled: true}]
        }),
        LENGTH: this.fb.group({
            on: [false],
            minLength: [{value: '', disabled: true}],
            maxLength: [{value: '', disabled: true}],
            message: [{value: '', disabled: true}]
        })
    });
    private sub: Subscription;

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        const updateForm$ = this.validatorsDataSubject.pipe(
            filter(data => !!data),
            tap(this.updateForm.bind(this))
        );
        const updateValidators$ = this.validatorsGroup.valueChanges.pipe(
            tap((data: ValidationControlsData) => this.validatorsChanged.emit(ValidatorsMapper.mapToValidationRules(data)))
        );
        const toggleRequiredControls$ = this.toggleValidatorControl$('REQUIRED');
        const toggleLengthControls$ = this.toggleValidatorControl$('LENGTH');
        this.sub = merge(updateForm$, updateValidators$, toggleRequiredControls$, toggleLengthControls$).subscribe({});
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    private toggleValidatorControl$(controlName: string): Observable<boolean> {
        const toggleValidatorControlName = 'on'; // a checkbox to on/off a validator
        return this.validatorsGroup.get(controlName)
            .get(toggleValidatorControlName)
            .valueChanges.pipe(
                tap((isRequiredOn: boolean) => this.toggleControls(controlName, isRequiredOn))
            );
    }

    private toggleControls(validatorName: string, isOn: boolean): void {
        const controls = (this.validatorsGroup.get(validatorName) as FormGroup).controls;
        for (const key of Object.keys(controls)) {
            if (key === 'on') {
                continue;
            }
            isOn ? controls[key].enable() : controls[key].disable();
        }
    }

    private updateForm(validators: ValidationControlsData): void {
        const areValidatorsEmpty = Object.keys(validators).length === 0;
        this.validatorsGroup.reset();

        if (!areValidatorsEmpty) {
            this.validatorsGroup.patchValue(validators);
            for (const validatorName in validators) {
                this.toggleControls(validatorName, validators[validatorName].on);
            }
        }
    }
}
