import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { ActivityPicklistSuggestion } from '../../../models/activity/activityPicklistSuggestion';

@Component({
    selector: 'ddp-activity-autocomplete-picklist-question',
    template: `
    <mat-form-field class="full-width ddp-autocomplete-field">
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
    </mat-form-field>`,
    styles: [`
        .full-width {
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
    private readonly ngUnsubscribe = new Subject();

    filteredSuggestions: ActivityPicklistSuggestion[];
    inputFormControl = new FormControl();

    constructor(translate: NGXTranslateService) {
        super(translate);
    }

    public ngOnInit(): void {
        const answer = this.block.answer && this.block.answer[0];
        if (answer) {
            this.inputFormControl
                .setValue(answer.detail || this.block.picklistSuggestions.find(option => option.value === answer.stableId));
        }

        this.inputFormControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value.trim() : value),
            distinctUntilChanged(),
            debounceTime(200),
            takeUntil(this.ngUnsubscribe)
        ).subscribe((value: string | ActivityPicklistSuggestion) => {
            const query = typeof value === 'string' ? value : value.label;
            this.filteredSuggestions = query ? this.filterOptions(query) : this.block.picklistSuggestions.slice();
            if (typeof value === 'string') {
                const minimalLengthForOption = 2;
                if (value.length >= minimalLengthForOption) {
                    const strictMatchInSuggestions = this.filteredSuggestions
                        .find(suggestion => suggestion.label.toLowerCase() === value.toLowerCase());
                    if (strictMatchInSuggestions) {
                        this.block.answer = [{ stableId: strictMatchInSuggestions.value, detail: null }];
                        this.valueChanged.emit(this.block.answer);
                    } else {
                        this.block.answer = [{ stableId: this.block.customValue, detail: value }];
                        if (this.block.customValue) {
                            this.valueChanged.emit(this.block.answer);
                        }
                    }
                }
            } else {
                this.block.answer = [{ stableId: value.value, detail: null }];
                this.valueChanged.emit(this.block.answer);
            }
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private filterOptions(name: string): ActivityPicklistSuggestion[] {
        const filterValue = name.toLowerCase();
        const result = [];
        let currentParent = null;

        for (const option of this.block.picklistSuggestions) {
            if (option.label.toLowerCase().includes(filterValue) ||
                option.parent?.toLowerCase().includes(filterValue)) {
                // we want to display group title even if the group title doesn't match the search
                if (option.label.toLowerCase().includes(filterValue) && option.parent && currentParent) {
                    result.push(currentParent);
                }
                result.push(option);
                currentParent = null;
            } else if (option.isParent) {
                currentParent = option;
            }
        }

        return result;
    }

    displayAutoComplete(option: ActivityPicklistSuggestion | string): string {
        return typeof option === 'string' ? option : (option?.label || '');
    }
}
