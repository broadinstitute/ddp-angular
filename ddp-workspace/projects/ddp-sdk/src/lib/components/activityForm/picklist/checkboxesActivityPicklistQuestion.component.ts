import { Component } from '@angular/core';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { PicklistSelectMode } from '../../../models/activity/picklistSelectMode';
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
                          (change)="optionChanged($event.checked, option);
                                    option.allowDetails ? updateCharactersLeftIndicator(option.stableId) : null">
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
                        {{questionIdToCharactersLeft[option.stableId]}}
                    </span>{{questionIdToCharacterLeftMsg[option.stableId]}}
                </p>
            </ng-container>
        </mat-list-item>

        <div class="ddp-nested-picklist" *ngIf="showNestedPicklist(option)">
            <p class="ddp-nested-picklist__title" *ngIf="option.nestedOptionsLabel">
                {{option.nestedOptionsLabel}}
            </p>
            <ng-container *ngFor="let nestedOption of option.nestedOptions">
                <ng-container *ngTemplateOutlet="item; context: {option: nestedOption}">
                </ng-container>
            </ng-container>
        </div>
    </ng-template>
    `,
    styles: [`
    :host ::ng-deep .mat-list .mat-list-item .mat-list-text,
    :host ::ng-deep .mat-list .mat-list-item .mat-line {
        overflow: visible;
    }

    :host ::ng-deep .mat-checkbox-layout .mat-checkbox-label {
        align-items: normal !important;
        white-space: normal !important;
    }

    :host ::ng-deep .mat-checkbox-label {
        padding: 0 5px 0 0;
    }

    .mat-checkbox {
        width: fit-content;
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
        const questionOptionDetailKey = this.getQuestionOptionDetailKey(id);
        if (this.block.answer) {
            this.block.answer
                .filter((item) => item.stableId === id)
                .forEach((item) => {
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
            this.valueChanged.emit([...this.block.answer]);
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

    public showNestedPicklist(option: ActivityPicklistOption): boolean {
        return option.nestedOptions && option.nestedOptions.length && this.getOptionSelection(option.stableId);
    }

    public optionChanged(value: boolean, option: ActivityPicklistOption): void {
        if (this.block.answer === null) {
            this.block.answer = this.createAnswer();
        }
        const isParentOption = this.block.picklistOptions.includes(option) || this.groupParentOptionSelected(option);
        if (isParentOption) {
            this.parentOptionSelected(value, option);
        } else {
            this.nestedOptionSelected(value, option);
        }
        this.valueChanged.emit([...this.block.answer]);
    }

    private createAnswer(): Array<ActivityPicklistAnswerDto> {
        return [];
    }

    private createAnswerDto(stableId: string): ActivityPicklistAnswerDto {
        const answer = {} as ActivityPicklistAnswerDto;
        answer.stableId = stableId;
        answer.detail = this.setDetailText(stableId);
        return answer;
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
    private getQuestionOptionDetailKey(optionStableId: string): string {
        return `${this.block.stableId}.${optionStableId}`;
    }

    private parentOptionSelected(value: boolean, option: ActivityPicklistOption): void {
        const { exclusive, stableId } = option;
        if (exclusive || this.hasSelectedExclusiveOption() || this.isOneAnswerAllowed(value)) {
            this.block.answer = [];
        }
        const answer = this.createAnswerDto(stableId);
        if (value) {
            this.block.answer.push(answer);
        } else {
            const index = this.answerIndex(stableId);
            this.block.answer.splice(index, 1);
            this.block.answer = this.removeNestedOptionsAnswers(option);
        }
    }

    private nestedOptionSelected(value: boolean, option: ActivityPicklistOption): void {
        const { exclusive, stableId } = option;
        const parentOption = this.block.picklistOptions.find(item => item.nestedOptions ? item.nestedOptions.includes(option) : []);
        if (exclusive || this.hasSelectedExclusiveNestedOption(parentOption.nestedOptions)) {
            const nestedOptionsIds = parentOption.nestedOptions.map(item => item.stableId);
            this.block.answer = this.block.answer.filter(answ => !nestedOptionsIds.includes(answ.stableId));
        }
        const answer = this.createAnswerDto(stableId);
        if (value) {
            this.block.answer.push(answer);
        } else {
            const index = this.answerIndex(stableId);
            if (index > -1) {
                this.block.answer.splice(index, 1);
            }
        }
    }

    private hasSelectedExclusiveNestedOption(options: Array<ActivityPicklistOption>): boolean {
        return this.block.answer.some(answer => {
            const option = options.find(opt => opt.stableId === answer.stableId);
            return option && option.exclusive;
        });
    }

    private groupParentOptionSelected(option: ActivityPicklistOption): boolean {
        return this.block.picklistGroups.some(group => group.options.includes(option));
    }

    private removeNestedOptionsAnswers(option: ActivityPicklistOption): Array<ActivityPicklistAnswerDto> {
        if (option.nestedOptions && option.nestedOptions.length) {
            const nestedOptionsIds = option.nestedOptions.map(item => item.stableId);
            return this.block.answer.filter(answer => !nestedOptionsIds.includes(answer.stableId));
        }
        return this.block.answer;
    }
}
