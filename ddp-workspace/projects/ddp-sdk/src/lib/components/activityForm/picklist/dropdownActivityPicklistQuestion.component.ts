import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { ActivityPicklistDetails } from './../../../models/activity/activityPicklistDetails';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';

@Component({
    selector: 'ddp-activity-dropdown-picklist-question',
    template: `
    <ng-container *ngIf="block.selectMode == 'MULTIPLE'; then matSelect else nativeSelect">
    </ng-container>

    <ng-template #matSelect>
        <div class="ddp-dropdown">
            <mat-select [value]="setMaterialSelected()"
                        [placeholder]="block.picklistLabel"
                        [disabled]="readonly"
                        [multiple]="true"
                        (selectionChange)="handleMaterialSelect($event)"
                        class="width">
                <mat-option *ngFor="let option of block.picklistOptions"
                            [value]="option.stableId">
                    {{option.optionLabel}}
                </mat-option>
            </mat-select>
        </div>
    </ng-template>

    <ng-template #nativeSelect>
        <select [value]="setNativeSelected()"
                [disabled]="readonly"
                (change)="handleNativeSelect($event.target.value)"
                class="width">
            <option value="">{{block.picklistLabel}}</option>
            <option *ngFor="let option of block.picklistOptions"
                    [value]="option.stableId">
                {{option.optionLabel}}
            </option>
        </select>
    </ng-template>

    <ng-container *ngIf="details.show">
        <mat-form-field class="width">
            <input matInput
                   (change)="detailTextChanged($event.target.value)"
                   (input)="updateCharactersLeftIndicator(details.stableId, $event.target.value)"
                   [disabled]="readonly"
                   [attr.maxlength]="block.detailMaxLength"
                   [placeholder]="details.placeholder"
                   [value]="details.text">
        </mat-form-field>
        <p *ngIf="!readonly" class="ddp-helper">
            <span class="ddp-counter-color">
                {{ questionIdToCharactersLeft[details.stableId] }}
            </span>{{ questionIdToCharacterLeftMsg[details.stableId] }}
        </p>
    </ng-container>`,
    styles: [`
        .width {
            width: 100%;
        }
    `]
})
export class DropdownActivityPicklistQuestion extends BaseActivityPicklistQuestion {
    public details: ActivityPicklistDetails;
    /**
     * If an option is marked exclusive, then when it's selected all other options should be de-selected.
     */
    private exclusiveChosen = false;

    constructor(private translate: NGXTranslateService) {
        super(translate);
        this.details = new ActivityPicklistDetails();
    }

    public setMaterialSelected(): Array<string> | string {
        const selected = Array<string>();
        if (this.block.answer) {
            if (this.block.answer.length) {
                this.block.answer.forEach((item) => {
                    selected.push(item.stableId);
                    this.showDetails(item.stableId);
                    if (this.details.show && this.details.text === null) {
                        // Populate with detail from answer if cached value doesn't exist
                        this.details.text = this.block.answer[0].detail;
                    }
                });
            }
        }
        return selected;
    }

    public setNativeSelected(): string {
        let selected = '';
        if (this.block.answer) {
            if (this.block.answer.length) {
                selected = this.block.answer[0].stableId;
                this.showDetails(selected);
                if (this.details.show && this.details.text === null) {
                    // Populate with detail from answer if cached value doesn't exist
                    this.details.text = this.block.answer[0].detail;
                }
            }
        }
        return selected;
    }

    public handleMaterialSelect(event: MatSelectChange): void {
        if (this.block.answer === null) {
            this.block.answer = this.createAnswer();
        }
        const answersStableIds = this.getAnswersStableIds();
        const answerAdded = this.getArraysDifference(event.value as Array<string>, answersStableIds);
        const answerRemoved = this.getArraysDifference(answersStableIds, event.value as Array<string>);
        const value = answerAdded.length ? answerAdded[0] : answerRemoved[0];
        if (this.isExclusive(value)) {
            this.block.answer = [];
            this.exclusiveChosen = true;
        } else if (this.exclusiveChosen) {
            this.block.answer = [];
            this.exclusiveChosen = false;
        }
        const answer = {} as ActivityPicklistAnswerDto;
        this.showDetails(value);
        answer.stableId = value;
        answer.detail = this.getDetailText(value);
        if (answerAdded.length) {
            this.block.answer.push(answer);
        } else {
            const index = this.answerIndex(value);
            this.block.answer.splice(index, 1);
            this.details.show = false;
        }
        this.valueChanged.emit(this.block.answer);
    }

    public handleNativeSelect(value: string): void {
        if (this.block.answer === null) {
            this.block.answer = this.createAnswer();
        }
        if (this.isDefaultOption(value)) {
            this.block.answer = [];
            this.details.show = false;
        } else {
            const answer = {} as ActivityPicklistAnswerDto;
            this.showDetails(value);
            answer.stableId = value;
            answer.detail = this.getDetailText(value);
            this.block.answer = [];
            this.block.answer.push(answer);
        }
        this.valueChanged.emit(this.block.answer);
    }

    public detailTextChanged(value: string): void {
        this.details.text = value;
        if (this.block.answer) {
            this.block.answer.forEach((item, i) => {
                if (this.details.isAssignedTo(item.stableId)) {
                    this.block.answer[i].detail = value;
                }
            });
            this.valueChanged.emit(this.block.answer);
        }
    }

    private showDetails(id: string): void {
        this.block.picklistOptions.forEach((item) => {
            if (item.stableId === id) {
                if (item.allowDetails) {
                    this.details.show = true;
                    this.details.assign(item.stableId, item.detailLabel);
                } else {
                    this.details.show = false;
                }
            }
        });
    }

    private getDetailText(id: string): string | null {
        if (this.details.show && this.details.isAssignedTo(id)) {
            return this.details.text;
        } else {
            return null;
        }
    }

    private isDefaultOption(id: string): boolean {
        return id === '';
    }

    private isExclusive(id: string): boolean {
        let exclusive = false;
        this.block.picklistOptions.forEach((item) => {
            if (item.stableId === id) {
                exclusive = item.exclusive;
            }
        });
        return exclusive;
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

    private createAnswer(): Array<ActivityPicklistAnswerDto> {
        return new Array<ActivityPicklistAnswerDto>();
    }

    private getAnswersStableIds(): Array<string> {
        return this.block.answer.map(answer => answer.stableId);
    }

    private getArraysDifference(target: Array<string>, additional: Array<string>): Array<string> {
        return target.filter(targetItem =>
            !additional.some(additionalItem => targetItem === additionalItem));
    }
}
