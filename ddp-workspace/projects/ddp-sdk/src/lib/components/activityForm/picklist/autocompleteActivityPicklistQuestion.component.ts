import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { ActivityPicklistNormalizedGroup } from '../../../models/activity/activityPicklistNormalizedGroup';
import { ActivityPicklistOption } from '../../../models/activity/activityPicklistOption';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { PicklistSortingPolicy } from '../../../services/picklistSortingPolicy.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { StringsHelper } from '../../../utility/stringsHelper';

@Component({
    selector: 'ddp-activity-autocomplete-picklist-question',
    template: `
    <mat-form-field class="full-width ddp-autocomplete-field">
        <input matInput
               #autocompleteInput
               [formControl]="inputFormControl"
               [placeholder]="block.picklistLabel"
               [matAutocomplete]="autoCompleteFromSource"
               (click)="openAutocompleteOptions()" />

        <mat-autocomplete #autoCompleteFromSource="matAutocomplete" class="autoCompletePanel" [displayWith]="displayAutoComplete">
            <mat-optgroup *ngFor="let group of filteredGroups">
                <strong [innerHtml]="group.name | searchHighlight: autocompleteInput.value : ignoredSymbolsInQuery"></strong>
                <ng-container *ngTemplateOutlet="generalOptionsList; context: {list: group.options}"></ng-container>
            </mat-optgroup>
            <ng-container *ngTemplateOutlet="generalOptionsList; context: {list: filteredOptions}"></ng-container>
            <ng-template #generalOptionsList let-list="list">
                <mat-option *ngFor="let suggestion of list" class="autoCompleteOption" [value]="suggestion">
                    <span [innerHtml]="suggestion.optionLabel | searchHighlight: autocompleteInput.value : ignoredSymbolsInQuery"></span>
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
    `]
})
export class AutocompleteActivityPicklistQuestion extends BaseActivityPicklistQuestion implements OnInit, OnDestroy, OnChanges {
    filteredGroups: ActivityPicklistNormalizedGroup[] = [];
    // options w/o a group
    filteredOptions: ActivityPicklistOption[] = [];
    inputFormControl = new FormControl();
    readonly ignoredSymbolsInQuery: string[];
    private readonly ngUnsubscribe = new Subject<void>();
    @ViewChild('autocompleteInput', { read: MatAutocompleteTrigger }) autocompleteTrigger: MatAutocompleteTrigger;
    @ViewChild('autoCompleteFromSource') autocompleteSource: MatAutocomplete;

    constructor(
        translate: NGXTranslateService,
        private sortPolicy: PicklistSortingPolicy,
        @Inject('ddp.config') public config: ConfigurationService
    ) {
        super(translate);
        this.ignoredSymbolsInQuery = this.config.picklistAutocompleteIgnoredSymbols;
    }

    public ngOnInit(): void {
        // reset the sort policy for picklists which don't need to have sorted options
        this.sortPolicy = this.shouldBeSorted ? this.sortPolicy : new PicklistSortingPolicy();
        this.initInputValue();

        const userQueryStream$ = this.inputFormControl.valueChanges.pipe(
            map(value => typeof value === 'string' ? value.trim() : value),
            distinctUntilChanged(),
            debounceTime(200),
            takeUntil(this.ngUnsubscribe)
        );

        const sortedPicklistGroups = this.sortPolicy.sortPicklistGroups(this.block.picklistGroups);
        const sortedPicklistOptions = this.sortPolicy.sortPicklistOptions(this.block.picklistOptions);

        userQueryStream$.pipe(startWith(''))
            .subscribe((value: string | ActivityPicklistOption) => {
                const query = typeof value === 'string' ? value : value.optionLabel;
                this.filteredGroups = this.filterOutEmptyGroups(query ? this.filterGroups(query, sortedPicklistGroups)
                    : sortedPicklistGroups.slice());
                this.filteredOptions = query ? this.filterOptions(query, sortedPicklistOptions) : sortedPicklistOptions.slice();
            });

        userQueryStream$.subscribe((value: string | ActivityPicklistOption) => {
            if (typeof value === 'string') {
                if (value.length) {
                    this.handleStringValue(value);
                } else {
                    this.block.answer = null;
                    this.valueChanged.emit(null);
                }
            } else {
                this.updateAnswer(value.stableId);
            }
        });

        window.addEventListener('scroll', this.onScroll, true);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (changes['readonly']?.currentValue) {
            this.inputFormControl.disable({emitEvent: false});
        } else {
            this.inputFormControl.enable({emitEvent: false});
        }
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        window.removeEventListener('scroll', this.onScroll, true);
    }

    public onScroll = (event): void => {
        const isAutoCompleteOptionsScrolling = event.target === this.autocompleteSource.panel?.nativeElement;

        if (this.autocompleteTrigger.panelOpen && !isAutoCompleteOptionsScrolling) {
            this.autocompleteTrigger.closePanel();
        }
    };

    public openAutocompleteOptions(): void {
        if (!this.autocompleteTrigger.panelOpen) {
            this.autocompleteTrigger.openPanel();
        }
    }

    private initInputValue(): void {
        const answer = this.block.answer && this.block.answer[0];
        if (answer) {
            const value = answer.detail || [
                ...this.block.picklistGroups.flatMap(group => group.options),
                ...this.block.picklistOptions
            ].find(option => option.stableId === answer.stableId);
            this.inputFormControl.setValue(value);
        }
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
                    this.valueChanged.emit([...this.block.answer]);
                }
            }
        }
    }

    private updateAnswer(value?: string, detail: string | null = null): void {
        this.block.answer = value ? [{ stableId: value, detail }] : [];
        this.valueChanged.emit([...this.block.answer]);
    }

    private filterGroups(query: string, groups: ActivityPicklistNormalizedGroup[]): ActivityPicklistNormalizedGroup[] {
        return groups
            .map(group => ({
                name: group.name,
                options: this.isMatched(group.name, query)
                    ? group.options
                    : this.filterOptions(query, group.options)}));
    }

    private filterOptions(query: string, options: ActivityPicklistOption[]): ActivityPicklistOption[] {
        return options.filter(option => this.isMatched(option.optionLabel, query));
    }

    private get shouldBeSorted(): boolean {
        return !this.config.notSortedPicklistAutocompleteStableIds.includes(this.block.stableId);
    }

    private filterOutEmptyGroups(groups: ActivityPicklistNormalizedGroup[]): ActivityPicklistNormalizedGroup[] {
        return groups.filter(group => group.options.length > 0);
    }

    displayAutoComplete(option: ActivityPicklistOption | string): string {
        return typeof option === 'string' ? option : (option?.optionLabel || '');
    }

    private isMatched(text: string, query: string): boolean {
        const normalizedText = StringsHelper.normalizeString(text, this.ignoredSymbolsInQuery);
        const normalizedQuery = StringsHelper.normalizeString(query, this.ignoredSymbolsInQuery);
        return StringsHelper.isIncluded(normalizedText, normalizedQuery);
    }
}
