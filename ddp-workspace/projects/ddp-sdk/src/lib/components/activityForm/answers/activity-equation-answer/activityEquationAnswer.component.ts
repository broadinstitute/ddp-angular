import { Component, Input } from '@angular/core';
import { ActivityEquationQuestionBlock } from '../../../../models/activity/activityEquationQuestionBlock';
import { DecimalHelper } from '../../../../utility/decimalHelper';
import { DecimalAnswer } from '../../../../models/activity/decimalAnswer';

@Component({
  selector: 'ddp-activity-equation-answer',
  template: `
      <ddp-question-prompt [block]="block"></ddp-question-prompt>
      <div class="equation-value">{{displayValue}}</div>
  `,
  styles: []
})
export class ActivityEquationAnswerComponent {
    @Input() block: ActivityEquationQuestionBlock;

    get displayValue(): string {
        return this.block.answer ? this.formatValue(this.block.answer) : null;
    }

    private formatValue(answer: DecimalAnswer): string {
        // align the answer decimal part
        const fullValue = `${DecimalHelper.mapDecimalAnswerToNumber(answer)}`;
        const [integerPart, decimalPart] = fullValue.split('.');
        return integerPart + (decimalPart ? `.${decimalPart.slice(0, this.block.maximumDecimalPlaces)}` : '');
    }
}
