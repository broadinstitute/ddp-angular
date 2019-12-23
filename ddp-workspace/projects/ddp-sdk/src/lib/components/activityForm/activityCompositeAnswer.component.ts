import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ActivityCompositeQuestionBlock } from '../../models/activity/activityCompositeQuestionBlock';
import { AnswerValue } from '../../models/activity/answerValue';
import { BlockVisibility } from '../../models/activity/blockVisibility';
import { ActivityQuestionBlock } from '../../models/activity/activityQuestionBlock';
import { ChildOrientation } from '../../models/activity/childOrientation';
import { QuestionType } from '../../models/activity/questionType';
import { ActivityDateQuestionBlock } from '../../models/activity/activityDateQuestionBlock';
import { DateRenderMode } from '../../models/activity/dateRenderMode';
import * as _ from 'underscore';

// todo see if style in here can be moved to shared resource, like external CSS

@Component({
    selector: 'ddp-activity-composite-answer',
    template: `
    <ddp-question-prompt [block]="block"></ddp-question-prompt>
    <ng-container *ngFor="let childBlockRow of childQuestionBlocks; let row = index">
        <p *ngIf="row > 0" class="Title-text PageContent-subtitle Normal">
            <span>{{ block.additionalItemText }}</span>
            <button *ngIf="!readonly" mat-icon-button (click)="removeRow(row)">
                <mat-icon class="ddp-close-button">close</mat-icon>
            </button>
        </p>
        <div [ngClass]="['ddp-answer-container', setOrientationClass(block.childOrientation)]">
            <ng-container *ngFor="let childBlock of childBlockRow; let column = index">
                <ddp-activity-answer [ngClass]="[(childBlock.questionType == 'text'
                                                && block.childOrientation !== 'VERTICAL') ? 'ddp-composite-text' : '',
                                                'ddp-answer-field']"
                                     [block]="childBlock"
                                     [readonly]="readonly"
                                     [validationRequested]="validationRequested"
                                     (valueChanged)="updateValue(row, column, $event)"
                                     (visibilityChanged)="updateVisibility($event)">
                </ddp-activity-answer>
            </ng-container>
        </div>
    </ng-container>
    <button *ngIf="block.allowMultiple && !readonly"
            type="button"
            class="ButtonFilled ButtonFilled--white button button_medium button_secondary button_new-item"
            (click)="addBlankRow()">
        {{ block.addButtonText }}
    </button>`,
    styles: [
        `.Title-text {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .vertical {
            display: flex;
            flex-direction: column;
        }

        .horizontal {
            display: flex;
            flex-direction: row;
        }`
    ]
})

// todo can we make some of these styles be common? button styles copied from physician form
export class ActivityCompositeAnswer implements OnChanges {
    @Input() block: ActivityCompositeQuestionBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Output() valueChanged: EventEmitter<AnswerValue> = new EventEmitter();
    @Output() visibilityChanged: EventEmitter<BlockVisibility[]> = new EventEmitter();
    public childQuestionBlocks: ActivityQuestionBlock<any>[][] = [];
    private convertQuestionToLabels: boolean;

    public ngOnChanges(changes: SimpleChanges): void {
        for (const propName in changes) {
            if (propName === 'block') {
                const newBlock: ActivityCompositeQuestionBlock = changes['block'].currentValue;
                if (changes[propName].isFirstChange()) {
                    this.convertQuestionToLabels = this.shouldSetLabelToBeQuestionText(newBlock.children);
                }
                const newAnswers: any[][] | null = newBlock.answer;
                if (!newAnswers || newAnswers.length === 0) {
                    // Case where we don't have any initial answers. We still need that first row!
                    this.childQuestionBlocks = [];
                    this.addBlankRow();
                } else {
                    this.childQuestionBlocks = newAnswers.map((rowOfAnswers: any[]) => {
                        // assuming order of answers same as order of questions here.
                        // And adding braces and a return statement here fixes a bug that should not be happening
                        // Breaks when running the compiled version of SDK  but OK when including library via symlink
                        // TODO investigate what is going on. Perhaps differences in TypeScript compiler target Javascript config?
                        return rowOfAnswers.map((answerContainer: any, index: number) =>
                            this.buildBlockForChildQuestion(newBlock.children[index], answerContainer, newBlock.shown));
                    });
                }
            }
        }
    }

    // Use original child question blocks as the prototypes to make real working ones
    // tslint:disable-next-line:max-line-length
    private buildBlockForChildQuestion(childQuestionBlock: ActivityQuestionBlock<any>, answerContainer: any, shown: boolean): ActivityQuestionBlock<any> {
        // Each child will need its own copy of the block to work properly
        const newQuestionBlock: ActivityQuestionBlock<any> = this.deepClone(childQuestionBlock);
        newQuestionBlock.validators = childQuestionBlock.validators.map((each) => this.deepClone(each));
        if (this.convertQuestionToLabels && !newQuestionBlock.label) {
            newQuestionBlock.label = childQuestionBlock.question;
            newQuestionBlock.question = '';
        }
        if (this.shouldSetPlaceholderToBeQuestionText(childQuestionBlock)) {
            newQuestionBlock.placeholder = newQuestionBlock.question;
            newQuestionBlock.question = null;
            if (childQuestionBlock.isRequired) {
                newQuestionBlock.placeholder += ' *';
            }
        }
        // clone does not update references to original object. we need to do that here.
        newQuestionBlock.validators.forEach((validator) => validator.question = newQuestionBlock);
        newQuestionBlock.answer = answerContainer === null ? null : answerContainer.value;
        newQuestionBlock.shown = shown;

        return newQuestionBlock;
    }

    // We assume question prompt should be used as placeholder in certain situations.
    // Relax this assumption if API adds an indicator for this.
    private shouldSetPlaceholderToBeQuestionText(childQuestionBlock: ActivityQuestionBlock<any>): boolean {
        if (childQuestionBlock.question && !(childQuestionBlock.placeholder)) {
            return (childQuestionBlock.questionType === QuestionType.Text)
                || (childQuestionBlock.questionType === QuestionType.Date);
        }
        return false;
    }

    public updateValue(row: number, column: number, value: AnswerValue): void {
        this.childQuestionBlocks[row][column].answer = value;
        const childAnswers = this.buildComponentAnswers();
        this.block.setAnswer(childAnswers, false);
        // No point in emitting if the value is not valid. Not gonna patch it anyways
        if (this.childQuestionBlocks[row][column].validate()) {
            const compositeAnswerValue: any[][] = this.childQuestionBlocks.map(childQuestionBlockRow =>
                childQuestionBlockRow.map((childQuestionBlock) => {
                    if (childQuestionBlock.validate()) {
                        return this.buildChildAnswer(childQuestionBlock);
                    } else {
                        return this.buildChildAnswer(childQuestionBlock, null);
                    }
                }));
            this.valueChanged.emit(compositeAnswerValue);
        }
    }

    public setOrientationClass(orientation: ChildOrientation | null): string {
        if (orientation === ChildOrientation.Horizontal) {
            return ChildOrientation.Horizontal.toLowerCase();
        } else if (orientation === ChildOrientation.Vertical) {
            return ChildOrientation.Vertical.toLowerCase();
        } else {
            return '';
        }
    }

    private buildComponentAnswers(): any[][] {
        return this.childQuestionBlocks.map(childQuestionBlockRow =>
            childQuestionBlockRow.map((childQuestionBlock) => {
                return this.buildChildAnswer(childQuestionBlock);
            }));
    }

    private buildChildAnswer(childQuestionBlock: ActivityQuestionBlock<any>, answer?: any): any {
        return {
            stableId: childQuestionBlock.stableId,
            value: _.isUndefined(answer) ? childQuestionBlock.answer : answer
        };
    }

    public addBlankRow(): void {
        this.childQuestionBlocks.push(this.block.children.map(questionBlock =>
            this.buildBlockForChildQuestion(questionBlock, null, this.block.shown)));
    }

    public removeRow(index: number): void {
        this.childQuestionBlocks.splice(index, 1);
        this.valueChanged.emit(this.buildComponentAnswers());
    }

    public updateVisibility(event: any): void { }

    // We need this method because we want to include the prototype in the clone.
    // Underscore's _.clone doesn't allow it.
    private deepClone<T>(block: T): T {
        return Object.create(Object.getPrototypeOf(block), Object.getOwnPropertyDescriptors(block));
    }
    // we will show labels if we have a question with a picklist date. Placeholder is not available
    private shouldSetLabelToBeQuestionText(childQuestionBlocks: ActivityQuestionBlock<any>[]): boolean {
        return childQuestionBlocks.filter(block => block.questionType === QuestionType.Date
            && (block as ActivityDateQuestionBlock).renderMode === DateRenderMode.Picklist).length > 0;
    }
}
