import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DecimalHelper } from '../../../../utility/decimalHelper';
import { SubmissionManager } from '../../../../services/serviceAgents/submissionManager.service';
import { ActivityEquationQuestionBlock } from '../../../../models/activity/activityEquationQuestionBlock';
import { AnswerResponseEquation } from '../../../../models/activity/answerResponseEquation';
import { LayoutType } from '../../../../models/layout/layoutType';
import { DecimalAnswer } from '../../../../models/activity/decimalAnswer';

@Component({
  selector: 'ddp-activity-equation-answer',
  template: `
      <ddp-question-prompt *ngIf="!isGridLayout()" [block]="block"></ddp-question-prompt>
      <div class="equation-value">{{displayValue}}</div>
  `
})
export class ActivityEquationAnswerComponent implements OnInit, OnDestroy {
    @Input() block: ActivityEquationQuestionBlock;
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    @Output() valueChanged: EventEmitter<DecimalAnswer[]> = new EventEmitter();
    private subscription: Subscription;

    constructor(private submissionManager: SubmissionManager) {
    }

    ngOnInit(): void {
        this.subscription = this.submissionManager.answerSubmissionResponse$.pipe(
            map(response =>
                (response.equations || []).filter(equation => this.block.stableId === equation.stableId)[0]
            )
        ).subscribe((equationToUpdate: AnswerResponseEquation) => {
            if (equationToUpdate) {
                const newValue = [equationToUpdate.values[this.block.compositeRowIndex || 0]];
                this.block.setAnswer(newValue, false);

                if (this.block.compositeRowIndex != null) {
                    // if the equation is a child of a composite - update the composite answers state
                    this.valueChanged.emit(newValue);
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get displayValue(): string {
        return this.block.answer && this.block.answer[0] ?
            DecimalHelper.formatDecimalAnswer(this.block.answer[0], this.block.maximumDecimalPlaces, true)
            : null;
    }

    public isGridLayout(): boolean {
        return this.layoutType === LayoutType.GRID;
    }
}
