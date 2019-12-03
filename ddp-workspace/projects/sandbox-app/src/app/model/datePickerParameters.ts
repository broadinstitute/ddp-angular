import { DateRenderMode, DateField } from 'ddp-sdk';

export interface DatePickerParameters {
    readonly: boolean;
    startYear: number;
    endYear: number;
    fields: Array<DateField>;
    renderMode: DateRenderMode;
    displayCalendar: boolean;
}