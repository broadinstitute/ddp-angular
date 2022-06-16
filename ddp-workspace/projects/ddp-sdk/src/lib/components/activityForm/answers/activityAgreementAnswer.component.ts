import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityAgreementQuestionBlock } from '../../../models/activity/activityAgreementQuestionBlock';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { LayoutType } from '../../../models/layout/layoutType';

@Component({
    selector: 'ddp-activity-agreement-answer',
    template: `
    <div class="ddp-agreement">
        <mat-checkbox [(ngModel)]="block.answer"
                      [disabled]="readonly"
                      [disableRipple]="true"
                      (change)="select($event)">
            <p *ngIf="!isGridLayout()" class="ddp-agreement-text"
               [ngClass]="{'ddp-required-question-prompt': block.isRequired}"
               [innerHTML]="block.question">
            </p>
        </mat-checkbox>
    </div>
    `,
    styles: [`
    :host ::ng-deep .mat-checkbox-inner-container {
        margin: 2px 8px 0 0;
    }
    `]
})
export class ActivityAgreementAnswer {
    @Input() block: ActivityAgreementQuestionBlock;
    @Input() readonly: boolean;
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();

    public select(value: MatCheckboxChange): void {
        this.block.answer = value.checked;
        this.valueChanged.emit(value.checked);
    }
    public isGridLayout(): boolean {
        return this.layoutType === LayoutType.GRID;
    }
}
