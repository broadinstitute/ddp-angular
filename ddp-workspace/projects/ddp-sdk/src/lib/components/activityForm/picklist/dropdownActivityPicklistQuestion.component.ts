import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { ActivityPicklistDetails } from '../../../models/activity/activityPicklistDetails';
import { PicklistSelectMode } from '../../../models/activity/picklistSelectMode';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';

@Component({
    selector: 'ddp-activity-dropdown-picklist-question',
    template: `
    <mat-form-field class="width ddp-dropdown-field">
      <ng-container *ngIf="block.selectMode === SELECT_MODE.MULTIPLE; then matSelect else nativeSelect">
      </ng-container>

      <ng-template #matSelect>
          <div class="ddp-dropdown">
              <mat-select [value]="setMaterialSelected()"
                          [placeholder]="block.picklistLabel"
                          [disabled]="readonly"
                          [multiple]="true"
                          (selectionChange)="handleMaterialSelect($event); details.show ? updateCharactersLeftIndicator(details.stableId) : null">
                  <mat-option *ngFor="let option of block.picklistOptions"
                              [value]="option.stableId">
                      {{option.optionLabel}}
                  </mat-option>
              </mat-select>
          </div>
      </ng-template>

      <ng-template #nativeSelect>
          <select matNativeControl
                  class="mat-select-native-control"
                  [(ngModel)]="nativeSelectedValue"
                  [disabled]="readonly"
                  (change)="handleNativeSelect($event.target.value); details.show ? updateCharactersLeftIndicator(details.stableId) : null">
              <option value="">{{block.picklistLabel}}</option>
              <option *ngFor="let option of block.picklistOptions"
                      [value]="option.stableId">
                  {{option.optionLabel}}
              </option>
          </select>
      </ng-template>
    </mat-form-field>

    <ng-container *ngIf="details.show">
        <mat-form-field class="width ddp-option-details-field">
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

        .ddp-dropdown-field ::ng-deep .mat-form-field-infix {
          width: auto;
        }
        @media only screen and (max-width: 1024px) {
          ::ng-deep .mat-form-field .mat-select-native-control{
          line-height: 17px;
            }
          ::ng-deep .mat-form-field .mat-select{
            line-height: 17px;
            }
          ::ng-deep .mat-form-field .mat-form-field-infix input{
            line-height: 17px;
            }
        }
    `]
})
export class DropdownActivityPicklistQuestion extends BaseActivityPicklistQuestion implements OnInit {
    public details: ActivityPicklistDetails;
    public readonly SELECT_MODE = PicklistSelectMode;
    public nativeSelectedValue = '';
    /**
     * If an option is marked exclusive, then when it's selected all other options should be de-selected.
     */
    private exclusiveChosen = false;

    constructor(private translate: NGXTranslateService) {
        super(translate);
        this.details = new ActivityPicklistDetails();
    }

    public ngOnInit(): void {
        this.exclusiveChosen = this.hasSelectedExclusiveOption();
        if (this.block.selectMode !== PicklistSelectMode.MULTIPLE) {
            this.nativeSelectedValue = this.findInitialNativeSelected();
        }
    }

    public setMaterialSelected(): Array<string> {
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
        this.valueChanged.emit([...this.block.answer]);
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
        this.valueChanged.emit([...this.block.answer]);
    }

    public detailTextChanged(value: string): void {
        this.details.text = value;
        if (this.block.answer) {
            this.block.answer.forEach((item, i) => {
                if (this.details.isAssignedTo(item.stableId)) {
                    this.block.answer[i].detail = value;
                }
            });
            this.valueChanged.emit([...this.block.answer]);
        }
    }

    private findInitialNativeSelected(): string {
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
        return [];
    }

    private getAnswersStableIds(): Array<string> {
        return this.block.answer.map(answer => answer.stableId);
    }

    private getArraysDifference(target: Array<string>, additional: Array<string>): Array<string> {
        return target.filter(targetItem =>
            !additional.some(additionalItem => targetItem === additionalItem));
    }
}
