import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractActivityQuestionBlock } from '../../models/activity/abstractActivityQuestionBlock';
import { AnswerValue } from '../../models/activity/answerValue';
import { QuestionType } from '../../models/activity/questionType';
import { BlockType } from '../../models/activity/blockType';
import { BlockVisibility } from '../../models/activity/blockVisibility';

@Component({
    selector: 'ddp-activity-answer',
    template: `
    <ddp-activity-boolean-answer *ngIf="isBooleanQuestion(block) && block.shown"
                                 [block]="block"
                                 [readonly]="readonly"
                                 (valueChanged)="onChange($event)">
    </ddp-activity-boolean-answer>
    <ddp-activity-text-answer *ngIf="isTextQuestion(block) && block.shown"
                              [block]="block"
                              [readonly]="readonly"
                              (valueChanged)="onChange($event)">
    </ddp-activity-text-answer>
    <ddp-activity-numeric-answer *ngIf="isNumericQuestion(block) && block.shown"
                                 [class]="'numeric-answer-' + block.stableId"
                                 [block]="block"
                                 [readonly]="readonly"
                                 (valueChanged)="onChange($event)">
    </ddp-activity-numeric-answer>
    <ddp-activity-picklist-answer *ngIf="isPicklistQuestion(block) && block.shown"
                                  [class]="'picklist-answer-' + block.stableId"
                                  [block]="block"
                                  [readonly]="readonly"
                                  (valueChanged)="onChange($event)">
    </ddp-activity-picklist-answer>
    <ddp-activity-date-answer *ngIf="isDateQuestion(block) && block.shown"
                              [block]="block"
                              [readonly]="readonly"
                              [validationRequested]="validationRequested"
                              (valueChanged)="onChange($event)">
    </ddp-activity-date-answer>
    <ddp-activity-composite-answer *ngIf="isCompositeQuestion(block) && block.shown"
                                   [class]="'composite-answer-' + block.stableId"
                                   [block]="block"
                                   [readonly]="readonly"
                                   [validationRequested]="validationRequested"
                                   (valueChanged)="onChange($event)">
    </ddp-activity-composite-answer>
    <ddp-activity-agreement-answer *ngIf="isAgreementQuestion(block) && block.shown"
                                   [block]="block"
                                   [readonly]="readonly"
                                   (valueChanged)="onChange($event)">
    </ddp-activity-agreement-answer>`
})

export class ActivityAnswerComponent {
    @Input() block: AbstractActivityQuestionBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    @Output() visibilityChanged: EventEmitter<BlockVisibility[]> = new EventEmitter();

    public onChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
    }

    public isBooleanQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Boolean;
    }

    public isTextQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Text;
    }

    public isNumericQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Numeric;
    }

    public isPicklistQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Picklist;
    }

    public isDateQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Date;
    }

    public isCompositeQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Composite;
    }

    public isAgreementQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Agreement;
    }

    public isQuestion(block: AbstractActivityQuestionBlock): boolean {
        return block.blockType === BlockType.Question;
    }
}
