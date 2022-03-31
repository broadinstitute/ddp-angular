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

interface CategorizedPicklistOptions {
    currentAutoCompleteOptions: ActivityPicklistOption[];
    userEnteredStringOption: ActivityPicklistOption;
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
            (blur)="onBlur($event.target.value, picklistOptions)"
        />

        <mat-autocomplete
            #autoCompleteFromSource="matAutocomplete"
            class="autoCompletePanel"
            [displayWith]="displayAutoComplete"
        >
            <mat-option
                *ngFor="let option of picklistOptions.currentAutoCompleteOptions"
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
    picklistOptions$: Observable<CategorizedPicklistOptions>;

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
                    this.studyGuid,
                    this.activityGuid,
                    this.block.stableId,
                    searchValue
                )
            ),
            map((data) => this.splitOtherOptionFromPLOptions(data.results)),
            map((splittedData) => splittedData
            )
        );
    }
    splitOtherOptionFromPLOptions(
        data: ActivityPicklistOption[]
    ): CategorizedPicklistOptions {
        return {
            currentAutoCompleteOptions: data.filter((pl) => pl.allowDetails !== true),
            userEnteredStringOption: data.find((pl) => pl.allowDetails === true),
        };
    }

    createNotListedOption(otherOption: ActivityPicklistOption): ActivityPicklistOption {
        return {
            ...otherOption,
            optionLabel: this.searchValue$.value.toLocaleUpperCase(),
        };
    }

    onInput(value): void {
        this.searchValue$.next(value);
    }

    displayAutoComplete(option: ActivityPicklistOption | string): string {
        return typeof option === 'string' ? option : option?.optionLabel || '';
    }

    onValueSelect(
        value: ActivityPicklistOption
    ): void {
        this.block.answer = value ? [{ stableId: value.stableId, detail:  value.allowDetails === true
        ? value.optionLabel
        : null }] : [];
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
        if(this.block.answer && this.block.answer[0]) {
            return this.block.answer[0].detail ? this.block.answer[0].detail: this.block.picklistOptions[0].optionLabel;
        }
        return '';
    }


    onBlur(value: string, data: CategorizedPicklistOptions): void {
        if(value) {
            const matchingOption = data.currentAutoCompleteOptions.find(pl => value.toLocaleLowerCase() === pl.optionLabel.toLocaleLowerCase());
            const plOption = matchingOption ? matchingOption : this.createNotListedOption(data.userEnteredStringOption);
            this.onValueSelect(plOption);
        }
    }
}
