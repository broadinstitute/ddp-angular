import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import * as _ from 'underscore';
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
    @Output() validatorsChanged = new EventEmitter<any>();

    validatorsDataSubject = new BehaviorSubject<ValidationControlsData | boolean>(false);
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

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        const updateForm$ = this.validatorsDataSubject.pipe(
            filter(data => !_.isBoolean(data)),
            tap(this.updateForm.bind(this))
        );
        const updateValidators$ = this.validatorsGroup.valueChanges.pipe(
            tap((data: ValidationControlsData) => this.validatorsChanged.emit(ValidatorsMapper.mapToValidationRules(data)))
        );
        const toggleRequiredControls$ = this.validatorsGroup.get('REQUIRED').get('on').valueChanges.pipe(
            tap((isRequiredOn: boolean) => this.toggleControls('REQUIRED', isRequiredOn))
        );
        const toggleLengthControls$ = this.validatorsGroup.get('LENGTH').get('on').valueChanges.pipe(
            tap((isRequiredOn: boolean) => this.toggleControls('LENGTH', isRequiredOn))
        );

        this.sub = merge(updateForm$, updateValidators$, toggleRequiredControls$, toggleLengthControls$).subscribe();
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    addValidators() {
        this.showValidatorsBlock();
        this.validatorsGroup.reset();
    }

    private toggleControls(validatorName: string, isOn: boolean) {
        const controls = (this.validatorsGroup.get(validatorName) as FormGroup).controls;
        for (const key of Object.keys(controls)) {
            if (key === 'on') continue;
            isOn ? controls[key].enable() : controls[key].disable();
        }
    }

    private updateForm(validators: ValidationControlsData) {
        const areValidatorsEmpty = Object.keys(validators).length === 0;
        this.validatorsGroup.reset();

        if (areValidatorsEmpty) {
           this.hideValidatorsBlock();
        } else {
            this.validatorsGroup.patchValue(validators);
            for (const validatorName in validators) {
                this.toggleControls(validatorName, validators[validatorName].on)
            }
        }
    }

    private hideValidatorsBlock() {
        this.validatorsDataSubject.next(false);
    }

    private showValidatorsBlock() {
        this.validatorsDataSubject.next(true);
    }
}
