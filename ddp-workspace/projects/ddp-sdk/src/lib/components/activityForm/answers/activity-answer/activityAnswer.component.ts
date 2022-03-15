import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractActivityQuestionBlock } from '../../../../models/activity/abstractActivityQuestionBlock';
import { AnswerValue } from '../../../../models/activity/answerValue';
import { QuestionType } from '../../../../models/activity/questionType';
import { BlockType } from '../../../../models/activity/blockType';

@Component({
    selector: 'ddp-activity-answer',
    template: `
        <ng-container *ngIf="block.shown">
            <ddp-activity-boolean-answer *ngIf="isBooleanQuestion(block)"
                                         [class]="'boolean-answer-' + block.stableId"
                                         [block]="block"
                                         [readonly]="readonly"
                                         (valueChanged)="onChange($event)">
            </ddp-activity-boolean-answer>
            <ddp-activity-text-answer *ngIf="isTextQuestion(block)"
                                      [block]="block"
                                      [readonly]="readonly"
                                      (valueChanged)="onChange($event)">
            </ddp-activity-text-answer>
            <ddp-activity-numeric-answer *ngIf="isNumericQuestion(block) || isDecimalQuestion(block)"
                                         [class]="'numeric-answer-' + block.stableId"
                                         [block]="block"
                                         [readonly]="readonly"
                                         (valueChanged)="onChange($event)">
            </ddp-activity-numeric-answer>
            <ddp-activity-picklist-answer  *ngIf="isPicklistQuestion(block)"
                                            [class]="'picklist-answer-' + block.stableId"
                                            [block]="block"
                                            [readonly]="readonly"
                                            [studyGuid]="studyGuid"
                                            [activityGuid]="activityGuid"
                                            (valueChanged)="onChange($event)"
        >
        </ddp-activity-picklist-answer>
            <ddp-activity-date-answer *ngIf="isDateQuestion(block)"
                                      [class]="'date-answer-' + block.stableId"
                                      [block]="block"
                                      [readonly]="readonly"
                                      [validationRequested]="validationRequested"
                                      (valueChanged)="onChange($event)">
            </ddp-activity-date-answer>
            <ddp-activity-composite-answer *ngIf="isCompositeQuestion(block)"
                                           [class]="'composite-answer-' + block.stableId"
                                           [block]="block"
                                           [readonly]="readonly"
                                           [validationRequested]="validationRequested"
                                           (valueChanged)="onChange($event)"
                                           (componentBusy)="componentBusy.next($event)">
            </ddp-activity-composite-answer>
            <ddp-activity-agreement-answer *ngIf="isAgreementQuestion(block)"
                                           [block]="block"
                                           [readonly]="readonly"
                                           (valueChanged)="onChange($event)">
            </ddp-activity-agreement-answer>
            <ddp-activity-file-answer *ngIf="isFileQuestion(block)"
                                      [class]="'file-answer-' + block.stableId"
                                      [block]="block"
                                      [readonly]="readonly"
                                      [studyGuid]="studyGuid"
                                      [activityGuid]="activityGuid"
                                      (valueChanged)="onChange($event)"
                                      (componentBusy)="componentBusy.next($event)">
            </ddp-activity-file-answer>
            <ddp-activity-matrix-answer *ngIf="isMatrixQuestion(block)"
                                        [class]="'matrix-answer-' + block.stableId"
                                        [block]="block"
                                        [readonly]="readonly"
                                        (valueChanged)="onChange($event)">
            </ddp-activity-matrix-answer>
            <ddp-activity-instance-select-answer *ngIf="isActivityInstanceSelectQuestion(block)"
                                                 [class]="'activity-instance-select-answer-' + block.stableId"
                                                 [block]="block"
                                                 [readonly]="readonly"
                                                 (valueChanged)="onChange($event)"
                                                 (componentBusy)="componentBusy.next($event)"
            ></ddp-activity-instance-select-answer>
            <span *ngIf="block.additionalInfoFooter"
                  [innerHTML]="block.additionalInfoFooter"
                  class="ddp-activity-answer__info-footer">
      </span>
        </ng-container>`,
    styleUrls: ['activityAnswer.component.scss']
})

export class ActivityAnswerComponent {
    @Input() block: AbstractActivityQuestionBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Input() studyGuid: string;
    @Input() activityGuid: string;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    @Output() componentBusy = new EventEmitter<boolean>();

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

    public isDecimalQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Decimal;
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

    public isFileQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.File;
    }

    public isMatrixQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.Matrix;
    }

    public isActivityInstanceSelectQuestion(block: AbstractActivityQuestionBlock): boolean {
        return this.isQuestion(block) && block.questionType === QuestionType.ActivityInstanceSelect;
    }

    private isQuestion(block: AbstractActivityQuestionBlock): boolean {
        return block.blockType === BlockType.Question;
    }
}
