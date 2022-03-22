import { Component, Inject, Input, OnInit, SimpleChanges } from '@angular/core';
import {
    BehaviorSubject,
    debounceTime,
    distinctUntilChanged,
    map,
    Observable,
    of,
    switchMap,
    tap,
} from 'rxjs';
import { ActivityPicklistNormalizedGroup } from '../../../models/activity/activityPicklistNormalizedGroup';
import { ActivityPicklistOption } from '../../../models/activity/activityPicklistOption';
import { ActivityPicklistQuestionBlock } from '../../../models/activity/activityPicklistQuestionBlock';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';
import { ActivityServiceAgent } from '../../../services/serviceAgents/activityServiceAgent.service';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';

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
            [ngModel] = "block.picklistOptions[0].optionLabel"
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
        this.picklistOptions$ = this.searchValue$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap((searchValue) =>
                this.activityService.getPickListOptions(
                    this.block.stableId,
                    searchValue,
                    this.studyGuid,
                    this.activityGuid
                )
            ),
            map((data) => data.results)
        );
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
        this.block.answer = value ? [{ stableId: value.stableId, detail }] : [];
        this.valueChanged.emit([...this.block.answer]);
    }

}
