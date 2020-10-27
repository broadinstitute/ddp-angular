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
              <span [innerHTML]="option.optionLabel"></span>
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

        <div class="ddp-sub-picklist" *ngIf="option.subPicklistOptions && option.subPicklistOptions.length && getOptionSelection(option.stableId)">
            <p class="ddp-sub-picklist__title" *ngIf="option.subPicklistOptionsLabel">{{option.subPicklistOptionsLabel}}</p>
            <ng-container *ngFor="let subOption of option.subPicklistOptions">
                <ng-container *ngTemplateOutlet="item; context: {option: subOption}">
                </ng-container>
            </ng-container>
        </div>
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
    // map of question stableId + option stable id -> detail text used to save detail text
    // in browser even when option is not selected
    private cachedDetailTextForQuestionAndOption: Record<string, string> = {};

    constructor(private translate: NGXTranslateService) {
        super(translate);
    }

    public setDetailText(id: string): string | null {
        let text: string | null = null;
        const questionOptionDetailKey = this.getQuestionOptionKey(id);
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
                    this.cachedDetailTextForQuestionAndOption[this.getQuestionOptionKey(id)] = value;
                }
            });
            this.valueChanged.emit(this.block.answer);
        }
    }

    public getOptionSelection(stableId: string): boolean {
        let selected = false;
        if (this.block.answer) {
            this.block.answer.forEach((item) => {
                if (item.stableId === stableId) {
                    selected = true;
                }
            });
        }
        return selected;
    }

    public optionChanged(value: boolean, option: ActivityPicklistOption): void {
        if (this.block.answer === null) {
            this.block.answer = this.createAnswer();
        }
        const regularOption = this.block.picklistOptions.includes(option);
        if (regularOption) {
            this.optionSelected(value, option);
        } else {
            this.subOptionSelected(value, option);
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

    private isOneAnswerAllowed(answer: boolean): boolean {
        return answer && this.block.selectMode === PicklistSelectMode.SINGLE;
    }

    /**
     * Makes a key of question stable id and option stable id
     * to squirrel away the detail text when value is unselected
     */
    private getQuestionOptionKey(optionStableId: string): string {
        return this.block.stableId + '.' + optionStableId;
    }

    private optionSelected(value: boolean, option: ActivityPicklistOption): void {
        const { exclusive, stableId } = option;
        if (exclusive || this.hasSelectedExclusiveOption() || this.isOneAnswerAllowed(value)) {
            this.block.answer = [];
        }
        const answer = {} as ActivityPicklistAnswerDto;
        answer.stableId = stableId;
        answer.detail = this.setDetailText(stableId);
        if (value) {
            this.block.answer.push(answer);
        } else {
            const index = this.answerIndex(stableId);
            this.block.answer.splice(index, 1);
            this.block.answer = this.removeSubAnswers(option);
        }
    }

    private subOptionSelected(value: boolean, option: ActivityPicklistOption): void {
        const { exclusive, stableId } = option;
        const parentOption = this.block.picklistOptions.find(item => item.subPicklistOptions ? item.subPicklistOptions.includes(option) : []);
        if (exclusive || this.hasSelectedExclusiveSubOption(parentOption.subPicklistOptions)) {
            const subOptionsIds = parentOption.subPicklistOptions.map(item => item.stableId);
            this.block.answer = this.block.answer.filter(answer => !subOptionsIds.includes(answer.stableId));
        }
        const answer = {} as ActivityPicklistAnswerDto;
        answer.stableId = stableId;
        answer.detail = this.setDetailText(stableId);
        if (value) {
            this.block.answer.push(answer);
        } else {
            const index = this.answerIndex(stableId);
            if (index > -1) {
                this.block.answer.splice(index, 1);
            }
        }
    }

    private hasSelectedExclusiveSubOption(options: Array<ActivityPicklistOption>): boolean {
        let hasExclusive = false;
        hasExclusive = this.block.answer.some(selected => {
            const option = options.find(option => option.stableId === selected.stableId);
            return option && option.exclusive;
        });
        return hasExclusive;
    }

    private removeSubAnswers(option: ActivityPicklistOption): Array<ActivityPicklistAnswerDto> {
        if (option.subPicklistOptions && option.subPicklistOptions.length) {
            const subOptionsIds = option.subPicklistOptions.map(item => item.stableId);
            return this.block.answer.filter(answer => !subOptionsIds.includes(answer.stableId));
        }
        return this.block.answer;
    }
}
