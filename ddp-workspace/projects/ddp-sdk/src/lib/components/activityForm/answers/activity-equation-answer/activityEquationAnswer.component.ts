import { Component, Input } from '@angular/core';
import { ActivityEquationQuestionBlock } from '../../../../models/activity/activityEquationQuestionBlock';
import { DecimalHelper } from '../../../../utility/decimalHelper';
import { DecimalAnswer } from '../../../../models/activity/decimalAnswer';

@Component({
  selector: 'ddp-activity-equation-answer',
  template: `
      <ddp-question-prompt [block]="block"></ddp-question-prompt>
      <div class="equation-value">{{displayValue}}</div>
  `
})
export class ActivityEquationAnswerComponent {
    @Input() block: ActivityEquationQuestionBlock;

    get displayValue(): string {
        return this.block.answer && this.block.answer[0] ? this.formatValue(this.block.answer[0]) : null;
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
