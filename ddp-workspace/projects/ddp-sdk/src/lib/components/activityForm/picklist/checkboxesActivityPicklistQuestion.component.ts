import { Component } from '@angular/core';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { PicklistSelectMode } from './../../../models/activity/picklistSelectMode';
import { ActivityPicklistOption } from '../../../models/activity/activityPicklistOption';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';

@Component({
    selector: 'ddp-activity-checkboxes-picklist-question',
    template: `
    <mat-list *ngIf="block.picklistOptions.length">
        <ng-container *ngFor="let option of block.picklistOptions">
            <ng-container *ngTemplateOutlet="item; context: {option: option}">
            </ng-container>
        </ng-container>
    </mat-list>

    <div *ngFor="let group of block.picklistGroups">
        <span class="ddp-picklist-group-title">
            {{group.name}}
        </span>
        <div class="ddp-picklist-group-container">
            <ng-container *ngFor="let option of group.options">
                <ng-container *ngTemplateOutlet="item; context: {option: option}">
                </ng-container>
            </ng-container>
        </div>
    </div>

    <ng-template #item let-option="option">
        <mat-list-item [ngClass]="{'ddp-picklist': option.allowDetails && getOptionSelection(option.stableId),
                                   'ddp-picklist-option-list-item': !option.groupId}">
            <mat-checkbox matLine
                          [checked]="getOptionSelection(option.stableId)"
                          [disabled]="readonly"
                          [disableRipple]="true"
                          (change)="optionChanged($event.checked, option); option.allowDetails ? updateCharactersLeftIndicator(option.stableId) : null">
                {{option.optionLabel}}
                <ddp-tooltip *ngIf="option.tooltip" class="tooltip" [text]="option.tooltip"></ddp-tooltip>
            </mat-checkbox>
            <ng-container *ngIf="option.allowDetails && getOptionSelection(option.stableId)">
                <mat-form-field matLine>
                    <input matInput
                           (change)="detailTextChanged($event.target.value, option.stableId)"
                           (input)="updateCharactersLeftIndicator(option.stableId, $event.target.value)"
                           [disabled]="readonly"
                           [attr.maxlength]="block.detailMaxLength"
                           [placeholder]="option.detailLabel"
                           [value]="setDetailText(option.stableId)">
                </mat-form-field>
                <p *ngIf="!readonly" matLine class="ddp-helper">
                    <span class="ddp-counter-color">
                        {{ questionIdToCharactersLeft[option.stableId] }}
                    </span>{{ questionIdToCharacterLeftMsg[option.stableId] }}
                </p>
            </ng-container>
        </mat-list-item>
    </ng-template>
    `,
    styles: [`
    :host ::ng-deep
    .mat-list .mat-list-item .mat-list-text,
    .mat-list .mat-list-item .mat-line {
        overflow: visible;
    }

    :host ::ng-deep
    .mat-checkbox-layout .mat-checkbox-label {
        align-items: normal !important;
        white-space: normal !important;
    }

    :host ::ng-deep
    .mat-checkbox-label {
        padding: 0 5px 0 0;
    }

    .ddp-picklist-group-container {
        display: grid;
        grid-template-columns: repeat(3, 33%);
    }
    `]
})
export class CheckboxesActivityPicklistQuestion extends BaseActivityPicklistQuestion {
    /**
     * If an option is marked exclusive, then when it's selected all other options should be de-selected.
     */
    private exclusiveChosen = false;

    // map of question stableId + option stable id -> detail text used to save detail text
    // in browser even when option is not selected
    private cachedDetailTextForQuestionAndOption: Record<string, string> = {};

    constructor(private translate: NGXTranslateService) {
        super(translate);
    }

    public setDetailText(id: string): string | null {
        let text: string | null = null;
        const questionOptionDetailKey = this.getQuestionOptionDetailKey(id);
        if (this.block.answer) {
            this.block.answer.filter((item) => {
                return item.stableId === id;
            }).forEach((item) => {
                text = item.detail;
                if (text) {
                    this.cachedDetailTextForQuestionAndOption[questionOptionDetailKey] = text;
                }
            });
        }
        if (text === null) {
            if (this.cachedDetailTextForQuestionAndOption[questionOptionDetailKey]) {
                text = this.cachedDetailTextForQuestionAndOption[questionOptionDetailKey];
            }
        }
        return text;
    }

    public detailTextChanged(value: string, id: string): void {
        if (this.block.answer) {
            this.block.answer.forEach((item, i) => {
                if (item.stableId === id) {
                    this.block.answer[i].detail = value;
                    this.cachedDetailTextForQuestionAndOption[this.getQuestionOptionDetailKey(id)] = value;
                }
            });
            this.valueChanged.emit(this.block.answer);
        }
    }

    public getOptionSelection(id: string): boolean {
        let selected = false;
        if (this.block.answer) {
            this.block.answer.forEach((item) => {
                if (item.stableId === id) {
                    selected = true;
                }
            });
        }
        return selected;
    }

    public optionChanged(value: boolean, option: ActivityPicklistOption): void {
        const { exclusive, stableId } = option;
        if (this.block.answer === null) {
            this.block.answer = this.createAnswer();
        }
        if (exclusive) {
            this.block.answer = [];
            this.exclusiveChosen = true;
        } else if (!exclusive && this.exclusiveChosen) {
            this.block.answer = [];
            this.exclusiveChosen = false;
        }
        const answer = {} as ActivityPicklistAnswerDto;
        answer.stableId = stableId;
        answer.detail = this.setDetailText(stableId);
        if (value) {
            if (this.block.selectMode === PicklistSelectMode.SINGLE) {
                this.block.answer = [];
            }
            this.block.answer.push(answer);
        } else {
            const index = this.answerIndex(stableId);
            this.block.answer.splice(index, 1);
        }
        this.valueChanged.emit(this.block.answer);
    }

    private createAnswer(): Array<ActivityPicklistAnswerDto> {
        return new Array<ActivityPicklistAnswerDto>();
    }

    private answerIndex(id: string): number {
        let index = -1;
        if (this.block.answer) {
            this.block.answer.forEach((item, i) => {
                if (item.stableId === id) {
                    index = i;
                }
            });
        }
        return index;
    }

    /**
     * Makes a key of question stable id and option stable id
     * to squirrel away the detail text when value is unselected
     */
    private getQuestionOptionDetailKey(optionStableId: string): string {
        return this.block.stableId + '.' + optionStableId;
    }
}
