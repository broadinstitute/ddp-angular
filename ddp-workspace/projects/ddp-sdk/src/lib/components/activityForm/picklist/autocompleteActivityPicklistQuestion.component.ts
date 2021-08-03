import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { ActivityPicklistNormalizedGroup } from '../../../models/activity/activityPicklistNormalizedGroup';
import { ActivityPicklistOption } from '../../../models/activity/activityPicklistOption';

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
            <mat-optgroup *ngFor="let group of filteredGroups">
                <strong [innerHtml]="group.name | searchHighlight: autocompleteInput.value"></strong>
                <ng-container *ngTemplateOutlet="generalOptionsList; context: {list: group.options}"></ng-container>
            </mat-optgroup>
            <ng-container *ngTemplateOutlet="generalOptionsList; context: {list: filteredOptions}"></ng-container>
            <ng-template #generalOptionsList let-list="list">
                <mat-option *ngFor="let suggestion of list" class="autoCompleteOption" [value]="suggestion">
                    <span [innerHtml]="suggestion.optionLabel | searchHighlight: autocompleteInput.value"></span>
                </mat-option>
            </ng-template>
        </mat-autocomplete>
    </mat-form-field>`,
    styles: [`
        .full-width {
            width: 100%;
        }

        .ddp-autocomplete-field ::ng-deep .mat-form-field-infix {
          width: auto;
        }

        .mat-optgroup ::ng-deep .mat-optgroup-label {
            color: inherit;
        }
    `]
})
export class AutocompleteActivityPicklistQuestion extends BaseActivityPicklistQuestion implements OnInit, OnDestroy {
    private readonly ngUnsubscribe = new Subject();

    filteredGroups: ActivityPicklistNormalizedGroup[] = [];
    // options w/o a group
    filteredOptions: ActivityPicklistOption[] = [];
    inputFormControl = new FormControl();

    constructor(translate: NGXTranslateService) {
        super(translate);
    }

    public ngOnInit(): void {
        const answer = this.block.answer && this.block.answer[0];
        if (answer) {
            const value = answer.detail || [
                ...this.block.picklistGroups.flatMap(group => group.options),
                ...this.block.picklistOptions
            ].find(option => option.stableId === answer.stableId);
            this.inputFormControl.setValue(value);
        }

        const userQueryStream = this.inputFormControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value.trim() : value),
            distinctUntilChanged(),
            debounceTime(200),
            takeUntil(this.ngUnsubscribe)
        );

        userQueryStream.pipe(startWith('')).subscribe((value: string | ActivityPicklistOption) => {
            const query = typeof value === 'string' ? value : value.optionLabel;
            this.filteredGroups = this.filterOutEmptyGroups(query ? this.filterGroups(query) : this.block.picklistGroups.slice());
            this.filteredOptions = query ? this.filterOptions(query, this.block.picklistOptions) : this.block.picklistOptions.slice();
        });

        userQueryStream.subscribe((value: string | ActivityPicklistOption) => {
            if (typeof value === 'string') {
                if (value.length) {
                    this.handleStringValue(value);
                } else {
                    this.updateAnswer();
                }
            } else {
                this.updateAnswer(value.stableId);
            }
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    private handleStringValue(value: string): void {
        const minimalLengthForOption = 2;
        if (value.length >= minimalLengthForOption) {
            const options = [...this.filteredGroups.flatMap(group => group.options), ...this.filteredOptions];
            const strictMatchInSuggestions = options.find(suggestion => suggestion.optionLabel.toLowerCase() === value.toLowerCase());
            if (strictMatchInSuggestions) {
                this.updateAnswer(strictMatchInSuggestions.stableId);
            } else {
                this.block.answer = [{ stableId: this.block.customValue, detail: value }];
                if (this.block.customValue) {
                    this.valueChanged.emit(this.block.answer);
                }
            }
        }
    }

    private updateAnswer(value?: string, detail: string | null = null): void {
        this.block.answer = value ? [{ stableId: value, detail }] : [];
        this.valueChanged.emit(this.block.answer);
    }

    private filterGroups(name: string): ActivityPicklistNormalizedGroup[] {
        const filterValue = name.toLowerCase();
        return this.block.picklistGroups
            .map(group => ({
                name: group.name,
                options: group.name.toLowerCase().includes(filterValue)
                    ? group.options
                    : this.filterOptions(filterValue, group.options)}));
    }

    private filterOptions(name: string, options: ActivityPicklistOption[]): ActivityPicklistOption[] {
        const filterValue = name.toLowerCase();
        return options.filter(option => option.optionLabel.toLowerCase().includes(filterValue));
    }

    filterOutEmptyGroups(groups: ActivityPicklistNormalizedGroup[]): ActivityPicklistNormalizedGroup[] {
        return groups.filter(group => group.options.length > 0);
    }

    displayAutoComplete(option: ActivityPicklistOption | string): string {
        return typeof option === 'string' ? option : (option?.optionLabel || '');
    }
}
