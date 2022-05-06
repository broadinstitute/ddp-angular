import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DecimalHelper } from '../../../../utility/decimalHelper';
import { SubmissionManager } from '../../../../services/serviceAgents/submissionManager.service';
import { ActivityEquationQuestionBlock } from '../../../../models/activity/activityEquationQuestionBlock';
import { AnswerResponseEquation } from '../../../../models/activity/answerResponseEquation';

@Component({
  selector: 'ddp-activity-equation-answer',
  template: `
      <ddp-question-prompt [block]="block"></ddp-question-prompt>
      <div class="equation-value">{{displayValue}}</div>
  `
})
export class ActivityEquationAnswerComponent implements OnInit, OnDestroy {
    @Input() block: ActivityEquationQuestionBlock;
    private subscription: Subscription;

    constructor(private submissionManager: SubmissionManager) {
    }

    ngOnInit(): void {
        this.subscription = this.submissionManager.answerSubmissionResponse$.pipe(
            map(response =>
                (response.equations || []).filter(equation => this.block.stableId === equation.stableId)[0]
            )
        ).subscribe((equationToUpdate: AnswerResponseEquation) => {
            equationToUpdate && this.block.setAnswer([equationToUpdate.values[this.block.compositeRowIndex || 0]], false);
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
}
