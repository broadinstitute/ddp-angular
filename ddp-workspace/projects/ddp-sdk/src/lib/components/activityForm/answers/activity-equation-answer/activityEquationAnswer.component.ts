import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DecimalHelper } from '../../../../utility/decimalHelper';
import { SubmissionManager } from '../../../../services/serviceAgents/submissionManager.service';
import { DecimalAnswer } from '../../../../models/activity/decimalAnswer';
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
        this.subscription = this.submissionManager.answerSubmissionResponse$.subscribe(response => {
            this.updateEquationQuestions(response.equations);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get displayValue(): string {
        return this.block.answer && this.block.answer[0] ? this.formatValue(this.block.answer[0]) : null;
    }

    private updateEquationQuestions(equations: AnswerResponseEquation[] = []): void {
        for (const equation of equations) {
            // update only single equations (not equations which are children of a composite question)
            if (this.block.stableId === equation.stableId && equation.values.length === 1) {
                this.block.setAnswer(equation.values, false);
            }
        }
    }

    private formatValue(answer: DecimalAnswer): string {
        // align the answer decimal part
        const fullValue = `${DecimalHelper.mapDecimalAnswerToNumber(answer)}`;
        const [integerPart, decimalPart] = fullValue.split('.');
        return integerPart + this.getFormattedDecimalPart(decimalPart);
    }

    private getFormattedDecimalPart(decimalPart): string {
        const res = decimalPart ?
            decimalPart.slice(0, this.block.maximumDecimalPlaces?? undefined) :
            '0'.repeat(this.block.maximumDecimalPlaces);

        return res ? `.${res}` : '';
    }
}
