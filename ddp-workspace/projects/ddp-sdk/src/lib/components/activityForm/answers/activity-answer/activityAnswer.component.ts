import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractActivityQuestionBlock } from '../../../../models/activity/abstractActivityQuestionBlock';
import { AnswerValue } from '../../../../models/activity/answerValue';
import { QuestionType } from '../../../../models/activity/questionType';
import { BlockType } from '../../../../models/activity/blockType';

@Component({
    selector: 'ddp-activity-answer',
    template: `
        <ng-container *ngIf="block.shown">
            <ddp-activity-boolean-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Boolean)"
                                         [class]="'boolean-answer-' + block.stableId"
                                         [block]="block"
                                         [readonly]="readonly"
                                         (valueChanged)="onChange($event)">
            </ddp-activity-boolean-answer>
            <ddp-activity-text-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Text)"
                                      [block]="block"
                                      [readonly]="readonly"
                                      (valueChanged)="onChange($event)">
            </ddp-activity-text-answer>
            <ddp-activity-numeric-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Numeric) || isCertainTypeOfQuestion(block, QuestionType.Decimal)"
                                         [class]="'numeric-answer-' + block.stableId"
                                         [block]="block"
                                         [readonly]="readonly"
                                         (valueChanged)="onChange($event)">
            </ddp-activity-numeric-answer>
            <ddp-activity-picklist-answer  *ngIf="isCertainTypeOfQuestion(block, QuestionType.Picklist)"
                                            [class]="'picklist-answer-' + block.stableId"
                                            [block]="block"
                                            [readonly]="readonly"
                                            [studyGuid]="studyGuid"
                                            [activityGuid]="activityGuid"
                                            (valueChanged)="onChange($event)">
            </ddp-activity-picklist-answer>
            <ddp-activity-date-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Date)"
                                      [class]="'date-answer-' + block.stableId"
                                      [block]="block"
                                      [readonly]="readonly"
                                      [validationRequested]="validationRequested"
                                      (valueChanged)="onChange($event)">
            </ddp-activity-date-answer>
            <ddp-activity-composite-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Composite)"
                                           [class]="'composite-answer-' + block.stableId"
                                           [block]="block"
                                           [readonly]="readonly"
                                           [validationRequested]="validationRequested"
                                           [triggerChanges]="triggerChanges"
                                           (valueChanged)="onChange($event)"
                                           (componentBusy)="componentBusy.next($event)">
            </ddp-activity-composite-answer>
            <ddp-activity-agreement-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Agreement)"
                                           [block]="block"
                                           [readonly]="readonly"
                                           (valueChanged)="onChange($event)">
            </ddp-activity-agreement-answer>
            <ddp-activity-file-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.File)"
                                      [class]="'file-answer-' + block.stableId"
                                      [block]="block"
                                      [readonly]="readonly"
                                      [studyGuid]="studyGuid"
                                      [activityGuid]="activityGuid"
                                      (valueChanged)="onChange($event)"
                                      (componentBusy)="componentBusy.next($event)">
            </ddp-activity-file-answer>
            <ddp-activity-matrix-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Matrix)"
                                        [class]="'matrix-answer-' + block.stableId"
                                        [block]="block"
                                        [readonly]="readonly"
                                        (valueChanged)="onChange($event)">
            </ddp-activity-matrix-answer>
            <ddp-activity-instance-select-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.ActivityInstanceSelect)"
                                                 [class]="'activity-instance-select-answer-' + block.stableId"
                                                 [block]="block"
                                                 [readonly]="readonly"
                                                 (valueChanged)="onChange($event)"
                                                 (componentBusy)="componentBusy.next($event)">
            </ddp-activity-instance-select-answer>
            <ddp-activity-equation-answer *ngIf="isCertainTypeOfQuestion(block, QuestionType.Equation)"
                                          [class]="'equation-answer-' + block.stableId"
                                          [block]="block"
                                          [triggerChanges]="triggerChanges"
                                          [readonly]="readonly">
            </ddp-activity-equation-answer>
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
    @Input() triggerChanges: boolean;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    @Output() componentBusy = new EventEmitter<boolean>();
    readonly QuestionType = QuestionType;

    public onChange(value: AnswerValue): void {
        this.valueChanged.emit(value);
    }

    public isCertainTypeOfQuestion(block: AbstractActivityQuestionBlock, type: QuestionType): boolean {
        return block.blockType === BlockType.Question && block.questionType === type;
    }
}
