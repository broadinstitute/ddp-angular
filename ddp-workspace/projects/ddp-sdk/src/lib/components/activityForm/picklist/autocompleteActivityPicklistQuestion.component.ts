import {
    Component,
    HostListener,
    Inject,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { ActivityPicklistNormalizedGroup } from '../../../models/activity/activityPicklistNormalizedGroup';
import { ActivityPicklistOption } from '../../../models/activity/activityPicklistOption';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { PicklistSortingPolicy } from '../../../services/picklistSortingPolicy.service';
import { ConfigurationService } from '../../../services/configuration.service';

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
    `]
})
export class AutocompleteActivityPicklistQuestion extends BaseActivityPicklistQuestion implements OnInit, OnDestroy, OnChanges {
    @ViewChild(MatAutocompleteTrigger, {read: MatAutocompleteTrigger}) autoComplete: MatAutocompleteTrigger;

    filteredGroups: ActivityPicklistNormalizedGroup[] = [];
    // options w/o a group
    filteredOptions: ActivityPicklistOption[] = [];
    inputFormControl = new FormControl();
    private readonly ngUnsubscribe = new Subject();

    constructor(
        translate: NGXTranslateService,
        private sortPolicy: PicklistSortingPolicy,
        @Inject('ddp.config') public config: ConfigurationService
    ) {
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

        let sortedPicklistGroups;
        let sortedPicklistOptions;
        if (this.shouldBeSorted) {
            sortedPicklistGroups = this.sortPolicy.sortPicklistGroups(this.block.picklistGroups);
            sortedPicklistOptions = this.sortPolicy.sortPicklistOptions(this.block.picklistOptions);
        } else {
            sortedPicklistGroups = this.block.picklistGroups;
            sortedPicklistOptions = this.block.picklistOptions;
        }

        userQueryStream.pipe(startWith('')).subscribe((value: string | ActivityPicklistOption) => {
            const query = typeof value === 'string' ? value : value.optionLabel;
            this.filteredGroups = this.filterOutEmptyGroups(query ? this.filterGroups(query, sortedPicklistGroups)
                : sortedPicklistGroups.slice());
            this.filteredOptions = query ? this.filterOptions(query, sortedPicklistOptions) : sortedPicklistOptions.slice();
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

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);

        if (changes['readonly'].currentValue) {
            this.inputFormControl.disable({emitEvent: false});
        } else {
            this.inputFormControl.enable({emitEvent: false});
        }
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
                    this.valueChanged.emit([...this.block.answer]);
                }
            }
        }
    }

    private updateAnswer(value?: string, detail: string | null = null): void {
        this.block.answer = value ? [{ stableId: value, detail }] : [];
        this.valueChanged.emit([...this.block.answer]);
    }

    private filterGroups(name: string, groups: ActivityPicklistNormalizedGroup[]): ActivityPicklistNormalizedGroup[] {
        const filterValue = name.toLowerCase();
        return groups
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

    private get shouldBeSorted(): boolean {
        return !this.config.picklistsWithNoSorting.includes(this.block.stableId);
    }

    filterOutEmptyGroups(groups: ActivityPicklistNormalizedGroup[]): ActivityPicklistNormalizedGroup[] {
        return groups.filter(group => group.options.length > 0);
    }

    displayAutoComplete(option: ActivityPicklistOption | string): string {
        return typeof option === 'string' ? option : (option?.optionLabel || '');
    }
}
