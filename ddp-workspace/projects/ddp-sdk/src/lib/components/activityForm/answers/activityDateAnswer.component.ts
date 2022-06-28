import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivityDateQuestionBlock } from '../../../models/activity/activityDateQuestionBlock';
import { DateField } from '../../../models/activity/dateField';
import { DatePickerValue } from '../../../models/datePickerValue';
import { LoggingService } from '../../../services/logging.service';
import { LayoutType } from '../../../models/layout/layoutType';

@Component({
    selector: 'ddp-activity-date-answer',
    template: `
    <ddp-question-prompt [block]="block" *ngIf="!isGridLayout()"></ddp-question-prompt>
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
    @Input() layoutType: LayoutType = LayoutType.DEFAULT;
    @Output() valueChanged: EventEmitter<DatePickerValue> = new EventEmitter();
    private readonly LOG_SOURCE = 'ActivityDateAnswer';

    constructor(private logger: LoggingService) { }

    public handleChange(value: DatePickerValue | null): void {
        let dateValue: DatePickerValue = {
            month: null,
            day: null,
            year: null,
        };

        if (value !== null) {
            dateValue = {
                month: value.month,
                day: value.day,
                year: value.year
            };
        }

        // Assign answer value and trigger validations.
        this.block.answer = dateValue;
        this.logger.logEvent(this.LOG_SOURCE, `value ${JSON.stringify(dateValue)}`);
        // Emit answer value and trigger patch api call.
        this.valueChanged.emit(dateValue);
    }

    public get fields(): Array<string> {
        const result = [];
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

    public isGridLayout(): boolean {
        return this.layoutType === LayoutType.GRID;
    }
}
