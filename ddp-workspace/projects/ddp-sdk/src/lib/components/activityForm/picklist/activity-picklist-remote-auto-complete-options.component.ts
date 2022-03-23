import { Component, Input, OnInit } from '@angular/core';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    switchMap,
} from 'rxjs';
import { ActivityPicklistOption } from '../../../models/activity/activityPicklistOption';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { ActivityServiceAgent } from '../../../services/serviceAgents/activityServiceAgent.service';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';

interface SplittedData {
    plOptions: ActivityPicklistOption[];
    otherOption: ActivityPicklistOption;
}

@Component({
    selector: 'ddp-activity-picklist-remote-auto-complete-options',
    template: `<mat-form-field
        class="full-width ddp-autocomplete-field"
        *ngIf="picklistOptions$ | async as picklistOptions"
    >
        <input
            matInput
            #autocompleteInput
            [value]="searchValue$ | async"
            [placeholder]="block.picklistLabel"
            [matAutocomplete]="autoCompleteFromSource"
            (keyup)="onInput($event.target.value)"
        />

        <mat-autocomplete
            #autoCompleteFromSource="matAutocomplete"
            class="autoCompletePanel"
            [displayWith]="displayAutoComplete"
        >
            <mat-option
                *ngFor="let option of picklistOptions"
                class="autoCompleteOption"
                [value]="option"
                (click)="onValueSelect(option)"
            >
                <span
                    [innerHtml]="
                        option.optionLabel
                            | searchHighlight
                                : autocompleteInput.value
                                : ignoredSymbolsInQuery
                    "
                ></span>
            </mat-option>
        </mat-autocomplete>
    </mat-form-field>`,
    styles: [
        `
            .full-width {
                width: 100%;
            }

            .ddp-autocomplete-field ::ng-deep .mat-form-field-infix {
                width: auto;
            }
        `,
    ],
})
export class ActivityPicklistRemoteAutoCompleteOptionsComponent
    extends BaseActivityPicklistQuestion
    implements OnInit
{
    @Input() studyGuid: string;
    @Input() activityGuid: string;

    searchValue$ = new BehaviorSubject('');
    picklistOptions$: Observable<ActivityPicklistOption[]>;

    readonly ignoredSymbolsInQuery: string[];

    constructor(
        translate: NGXTranslateService,
        private activityService: ActivityServiceAgent
    ) {
        super(translate);
    }

    ngOnInit(): void {
        const initSearchValue = this.getAnswer();
        this.searchValue$ = new BehaviorSubject(initSearchValue);

        this.picklistOptions$ = this.searchValue$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap((searchValue) =>
                this.activityService.getPickListOptions(
                    this.block.stableId,
                    searchValue,
                    this.studyGuid,
                    this.activityGuid
                )
            ),
            map((data) => this.splitOtherOptionFromPLOptions(data.results)),
            map((splittedData) =>
                this.validateIfMissingOptionShouldBeDisplayed(
                    splittedData.plOptions
                )
                    ? this.createNotListedOption(splittedData)
                    : splittedData.plOptions
            )
        );
    }
    splitOtherOptionFromPLOptions(
        data: ActivityPicklistOption[]
    ): SplittedData {
        return {
            plOptions: data.filter((pl) => pl.stableId !== 'OTHER'),
            otherOption: data.find((pl) => pl.stableId === 'OTHER'),
        };
    }

    createNotListedOption(data: SplittedData) {
        const notListedOption = {
            ...data.otherOption,
            optionLabel: this.searchValue$.value.toLocaleUpperCase(),
        };
        return [...data.plOptions, notListedOption];
    }

    onInput(value): void {
        this.searchValue$.next(value);
    }

    displayAutoComplete(option: ActivityPicklistOption | string): string {
        return typeof option === 'string' ? option : option?.optionLabel || '';
    }

    onValueSelect(
        value: ActivityPicklistOption,
        detail: string | null = null
    ): void {
        this.block.answer = value
            ? [
                  {
                      stableId: value.stableId,
                      detail:
                          value.stableId === 'OTHER'
                              ? value.optionLabel
                              : detail,
                  },
              ]
            : [];
        this.valueChanged.emit([...this.block.answer]);
    }

    getInitialAnswerOptionLabel(): string {
        if (
            this.block.selectMode === 'SINGLE' &&
            this.block.picklistOptions.length
        ) {
            return this.block.picklistOptions[0].optionLabel;
        }
    }

    getAnswer(): string {
        const option = this.block.picklistOptions.find(
            (pl) => pl.stableId === this.block.answer[0].stableId
        );
        return this.block.answer
            ? option.stableId === 'OTHER'
                ? option.detailLabel
                : option.optionLabel
            : '';
    }

    validateIfMissingOptionShouldBeDisplayed(
        picklistOptions: ActivityPicklistOption[]
    ): boolean {
        return (
            this.searchValue$.value.length &&
            !picklistOptions.filter((pl) =>
                pl.optionLabel.includes(this.searchValue$.value)
            ).length
        );
    }
}
