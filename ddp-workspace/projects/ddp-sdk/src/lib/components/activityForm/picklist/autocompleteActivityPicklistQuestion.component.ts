import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

export interface Suggestion {
    label: string;
    isParent?: boolean;
    parent?: string;
    value: string;
}

@Component({
    selector: 'ddp-activity-autocomplete-picklist-question',
    template: `
    <mat-form-field class="width ddp-autocomplete-field">
        <input matInput
               #autocompleteInput
               [formControl]="inputFormControl"
               [placeholder]="block.picklistLabel"
               [matAutocomplete]="autoCompleteFromSource" />

        <mat-autocomplete #autoCompleteFromSource="matAutocomplete" class="autoCompletePanel" [displayWith]="displayAutoComplete">
            <mat-option *ngFor="let suggestion of filteredSuggestions"
                        class="autoCompleteOption"
                        [value]="suggestion"
                        [class.parent]="suggestion.isParent"
                        [class.child]="suggestion.parent">
                <span [innerHtml]="suggestion.label | searchHighlight: autocompleteInput.value"></span>
            </mat-option>
        </mat-autocomplete>
        <mat-error *ngIf="inputFormControl.hasError('strictMatch')" translate>
            {{'SDK.Validators.Autocomplete' | translate : { text: block.question} }}
        </mat-error>
    </mat-form-field>`,
    styles: [`
        .width {
            width: 100%;
        }

        .ddp-autocomplete-field ::ng-deep .mat-form-field-infix {
          width: auto;
        }

        .parent {
            font-weight: bold;
        }

        .child ::ng-deep .mat-option-text {
            padding-left: 13px;
        }
    `]
})
export class AutocompleteActivityPicklistQuestion extends BaseActivityPicklistQuestion implements OnInit, OnDestroy {
    private allSuggestions: Suggestion[] = [];
    private readonly ngUnsubscribe = new Subject();

    filteredSuggestions: Suggestion[];
    inputFormControl = new FormControl();

    constructor(translate: NGXTranslateService) {
        super(translate);
    }

    public ngOnInit(): void {
        this.allSuggestions = this.generateSuggestions();
        const answer = this.block.answer && this.block.answer[0];
        if (answer) {
            this.inputFormControl.setValue(answer.detail || this.allSuggestions.find(option => option.value === answer.stableId));
        }

        const customVersionId = this.block.picklistOptions.find(option => option.allowDetails)?.stableId;

        this.inputFormControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value.trim() : value),
            distinctUntilChanged(),
            debounceTime(200),
            takeUntil(this.ngUnsubscribe)
        ).subscribe((value: string | Suggestion) => {
            const query = typeof value === 'string' ? value : value.label;
            this.filteredSuggestions = query ? this.filterOptions(query) : this.allSuggestions.slice();

            if (typeof value === 'string') {
                const minimalLengthForOption = 2;
                if (value.length >= minimalLengthForOption) {
                    const strictMatchInSuggestions = this.filteredSuggestions
                        .find(suggestion => suggestion.label.toLowerCase() === value.toLowerCase());
                    if (strictMatchInSuggestions) {
                        this.valueChanged.emit([{ stableId: strictMatchInSuggestions.value, detail: null }]);
                    } else if (customVersionId) {
                        this.valueChanged.emit([{ stableId: customVersionId, detail: value }]);
                    }

                    const validationError = strictMatchInSuggestions || customVersionId ? null : true;
                    this.inputFormControl.setErrors({ strictMatch: validationError });
                }
            } else {
                this.valueChanged.emit([{ stableId: value.value, detail: null }]);
            }
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private generateSuggestions(): Suggestion[] {
        return this.block.picklistOptions.reduce((acc, currentValue) => {
            if (currentValue.allowDetails) return acc;
            const suggestion: Suggestion = {
                label: currentValue.optionLabel,
                value: currentValue.stableId,
            };
            acc.push(suggestion);
            if (currentValue.nestedOptions?.length) {
                suggestion.isParent = true;

                for (const nestedOption of currentValue.nestedOptions) {
                    acc.push({
                        label: nestedOption.optionLabel,
                        value: nestedOption.stableId,
                        parent: currentValue.optionLabel
                    });
                }
            }
            return acc;
        }, [] as Suggestion[]);
    }

    private filterOptions(name: string): Suggestion[] {
        const filterValue = name.toLowerCase();
        const result = [];
        let currentParent = null;

        for (const option of this.allSuggestions) {
            if (option.label.toLowerCase().includes(filterValue) ||
                option.parent?.toLowerCase().includes(filterValue)) {
                // we want to display group title even if the group title doesn't match the search
                if (option.label.toLowerCase().includes(filterValue) && option.parent && currentParent) {
                    result.push(currentParent);
                    currentParent = null;
                }
                result.push(option);
            } else if (option.isParent) {
                currentParent = option;
            }
        }

        return result;
    }

    displayAutoComplete(option: Suggestion | string): string {
        return typeof option === 'string' ? option : (option?.label || '');
    }
}
