import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ActivityDateQuestionBlock } from '../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../models/activity/dateField';
import { DatePickerValue } from '../../models/datePickerValue';

@Component({
    selector: 'ddp-activity-date-answer',
    template: `
    <ddp-question-prompt [block]="block"></ddp-question-prompt>
    <div>
        <ddp-date [dateFields]="fields"
                  [readonly]="readonly"
                  [renderMode]="block.renderMode"
                  [label]="block.label"
                  [placeholder]="block.placeholder"
                  [showCalendar]="block.displayCalendar"
                  [dateValue]="block.answer"
                  [validationRequested]="validationRequested"
                  [startYear]="block.startYear"
                  [endYear]="block.endYear"
                  (valueChanged)="handleChange($event)">
        </ddp-date>
    </div>`
})
export class ActivityDateAnswer {
    @Input() block: ActivityDateQuestionBlock;
    @Input() readonly: boolean;
    @Input() validationRequested: boolean;
    @Output() valueChanged: EventEmitter<DatePickerValue> = new EventEmitter();

    public handleChange(value: DatePickerValue | null): void {
        if (value == null) {
            return;
        }
        const dateValue: DatePickerValue = {
            month: value.month,
            day: value.day,
            year: value.year
        };
        // Assign answer value and trigger validations.
        this.block.answer = dateValue;
        console.log(`value ${JSON.stringify(dateValue)}`);
        // Emit answer value and trigger patch api call.
        this.valueChanged.emit(dateValue);
    }

    public get fields(): Array<string> {
        const result = new Array<string>();
        this.block.fields.forEach(x => {
            if (x === DateField.Day) {
                result.push('DD');
            } else if (x === DateField.Month) {
                result.push('MM');
            } else if (x === DateField.Year) {
                result.push('YYYY');
            }
        });
        return result;
    }
}
