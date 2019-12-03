import { Component } from '@angular/core';
import { ActivityPicklistAnswerDto } from '../../../models/activity/activityPicklistAnswerDto';
import { BaseActivityPicklistQuestion } from './baseActivityPicklistQuestion.component';
import { NGXTranslateService } from '../../../services/internationalization/ngxTranslate.service';

@Component({
    selector: 'ddp-activity-radiobuttons-picklist-question',
    template: `
    <div>
        <mat-radio-group class="ddp-radio-group-column">
            <div *ngFor="let option of block.picklistOptions" class="margin-5">
                <mat-radio-button
                            [checked]="getOptionSelection(option.stableId)"
                            [value]="option.stableId"
                            [disabled]="readonly"
                            [disableRipple]="true"
                            (change)="select(option.stableId)">
                    {{option.optionLabel}}
                </mat-radio-button>
                <ng-container *ngIf="option.allowDetails && getOptionSelection(option.stableId)">
                    <mat-form-field>
                        <input matInput
                               (change)="detailTextChanged($event.target.value, option.stableId)"
                               (input)="updateCharactersLeftIndicator(option.stableId, $event.target.value)"
                               [disabled]="readonly"
                               [attr.maxlength]="block.detailMaxLength"
                               [placeholder]="option.detailLabel"
                               [value]="getAnswerDetailText(option.stableId)">
                    </mat-form-field>
                    <p *ngIf="!readonly" class="ddp-helper">
                        <span class="ddp-counter-color">
                            {{ questionIdToCharactersLeft[option.stableId] }}
                        </span>{{ questionIdToCharacterLeftMsg[option.stableId] }}
                    </p>
                </ng-container>
            </div>
        </mat-radio-group>
    </div>`,
    styles: [
        `.margin-5 {
            margin: 5px;
            display: flex;
            flex-direction: column;
        }

        .margin-bottom {
            margin-bottom: 15px
        }

        .example-input-field{
            width: 50%;
        }

        .ddp-radio-group-row {
            display: flex;
            flex-direction: row;
        }

        .ddp-radio-group-column {
            display: flex;
            flex-direction: column;
        }

        :host ::ng-deep
        .mat-radio-label {
            align-items: normal !important;
            white-space: normal !important;
        }`
    ]
})
export class RadioButtonsActivityPicklistQuestion extends BaseActivityPicklistQuestion {
    constructor(private translate: NGXTranslateService) {
        super(translate);
    }

    public detailTextChanged(value: string, id: string): void {
        if (this.block.answer) {
            this.block.answer.forEach((item, i) => {
                if (item.stableId === id) {
                    this.block.answer[i].detail = value;
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

    public select(id: string): void {
        const answer = {} as ActivityPicklistAnswerDto;
        answer.stableId = id;
        answer.detail = this.getAnswerDetailText(id);
        this.block.answer = [answer];
        this.valueChanged.emit(this.block.answer);
    }
}
