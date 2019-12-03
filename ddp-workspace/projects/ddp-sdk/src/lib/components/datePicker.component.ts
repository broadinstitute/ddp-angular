import { Component, Input, Output, OnChanges, SimpleChange, EventEmitter, ViewChild, Renderer2, AfterContentChecked } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DateService } from '../services/dateService.service';
import { DatePickerValue } from '../models/datePickerValue';
import { DateRenderMode } from '../models/activity/dateRenderMode';

@Component({
    selector: 'ddp-date',
    template: `
      <div *ngIf="renderMode == 'TEXT'" style="overflow: hidden;">
        <div style="display: flex; flex-direction: row;">
          <mat-dialog-content *ngFor="let dateField of dateFields; let fieldIdx = index">
            {{ (dateField == 'MM' && dateFields.indexOf('MM') > 0) ? ' / ' : '' }}
            <mat-form-field class="two-char-input" *ngIf="dateField == 'MM'" [floatLabel]="floatLabelType()">
              <mat-label *ngIf="label" [innerHTML]="label && fieldIdx === 0 ? label : ('')"></mat-label>
              <input matInput
                     appInputRestriction="integer"
                     [placeholder]="placeholder && dateFields.length == 1 ? placeholder : 'MM'"
                     size="3"
                     maxlength="2"
                     #MM
                     (change)="inputChanged()"
                     (blur)="formatDate()"
                     (input)="moveFocus($event.target.value, 'MM')"
                     [disabled]="readonly"
                     class="date-text"
                     [(ngModel)]="selectedMonth"/>
            </mat-form-field>
            {{ (dateField == 'DD' && dateFields.indexOf('DD') > 0) ? ' / ' : '' }}
            <mat-form-field class="two-char-input" *ngIf="dateField == 'DD'" [floatLabel]="floatLabelType()">
              <mat-label *ngIf="label" [innerHTML]="label && fieldIdx === 0 ? label : ('')"></mat-label>
              <input matInput
                     appInputRestriction="integer"
                     [placeholder]="placeholder && dateFields.length === 1 ? placeholder : 'DD'"
                     size="3"
                     maxlength="2"
                     #DD
                     (change)="inputChanged()"
                     (blur)="formatDate()"
                     (input)="moveFocus($event.target.value, 'DD')"
                     [disabled]="readonly"
                     class="date-text"
                     [(ngModel)]="selectedDay"/>
            </mat-form-field>
            {{ (dateField == 'YYYY' && dateFields.indexOf('YYYY') > 0) ? ' / ' : '' }}
            <mat-form-field class="four-char-input" *ngIf="dateField == 'YYYY'" [floatLabel]="floatLabelType()">
              <mat-label *ngIf="label" [innerHTML]="label && fieldIdx === 0 ? label : ('')"></mat-label>
              <input matInput
                     appInputRestriction="integer"
                     [placeholder]="(placeholder && dateFields.length == 1) ? placeholder : 'YYYY'"
                     size="5"
                     maxlength="4"
                     #YYYY
                     (change)="inputChanged()"
                     (input)="moveFocus($event.target.value, 'YYYY')"
                     [disabled]="readonly"
                     class="date-text"
                     [(ngModel)]="selectedYear"/>
            </mat-form-field>
          </mat-dialog-content>
        </div>
        <div *ngIf="showCalendar && !readonly" style="overflow: hidden;margin-top:10px">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <input matInput [matDatepicker]="picker" style="visibility: hidden;width:0px;"
                 (dateChange)="addEvent($event)">
        </div>
      </div>
      <div *ngIf="renderMode == 'SINGLE_TEXT'" style="overflow: hidden;">
        <div style="float: left;">
          <mat-form-field floatLabel="always">
            <mat-label *ngIf="label" [innerHTML]="label"></mat-label>
            <input matInput [matDatepicker]="picker"
                   [placeholder]="placeholder || 'Choose a date'" [(ngModel)]="singleDate" [ngModelOptions]="{updateOn: 'blur'}">
            <mat-datepicker-toggle *ngIf="showCalendar" matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      </div>
      <div *ngIf="renderMode == 'PICKLIST'" class="picklist ddp-answer-container">
        <div *ngFor="let dateField of dateFields; let fieldIdx = index"
             class="date-field ddp-answer-field"
             [ngClass]="{'ddp-date-field-margin': dateFields.length > 1}">
          <ng-template [ngIf]="label" [ngIfElse]="pickListWithoutLabels">
            <mat-form-field *ngIf="dateField === 'MM'" floatLabel="always">
              <mat-label [innerHTML]="fieldIdx === 0 ? label : ('')"></mat-label>
              <select matNativeControl
                      [(ngModel)]="dropdownMonth"
                      [disabled]="readonly"
                      (change)="inputChanged()">
                <ng-container *ngTemplateOutlet="monthOptions"></ng-container>
              </select>
            </mat-form-field>
            <mat-form-field *ngIf="dateField === 'DD'"  floatLabel="always">
              <mat-label [innerHTML]="fieldIdx === 0 ? label : ('')"></mat-label>
              <select matNativeControl
                      [(ngModel)]="dropdownDay"
                      [disabled]="readonly"
                      (change)="inputChanged()">
                <ng-container *ngTemplateOutlet="dayOptions"></ng-container>
              </select>
            </mat-form-field>

            <mat-form-field *ngIf="dateField == 'YYYY'"  floatLabel="always">
              <mat-label [innerHTML]="fieldIdx === 0 ? label : ('')"></mat-label>
              <select matNativeControl
                      [(ngModel)]="dropdownYear"
                      [disabled]="readonly"
                      (change)="inputChanged()">
                <ng-template *ngTemplateOutlet="yearOptions"></ng-template>
              </select>
            </mat-form-field>
          </ng-template>
          <ng-template #pickListWithoutLabels>
            <select *ngIf="dateField === 'MM'"
                    [(ngModel)]="dropdownMonth"
                    [disabled]="readonly"
                    (change)="inputChanged()">
              <ng-container *ngTemplateOutlet="monthOptions"></ng-container>
            </select>

            <select *ngIf="dateField === 'DD'"
                    [(ngModel)]="dropdownDay"
                    [disabled]="readonly"
                    (change)="inputChanged()">
              <ng-container *ngTemplateOutlet="dayOptions"></ng-container>
            </select>
            <select *ngIf="dateField == 'YYYY'"
                    [(ngModel)]="dropdownYear"
                    [disabled]="readonly"
                    (change)="inputChanged()">
              <ng-template *ngTemplateOutlet="yearOptions"></ng-template>
            </select>
          </ng-template>
        </div>
        <div *ngIf="showCalendar && !readonly" style="overflow: hidden;margin-top:10px">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <input size="0" matInput
                 [matDatepicker]="picker"
                 style="visibility: hidden;width:0px;"
                 [min]="minDate"
                 [max]="maxDate"
                 (dateChange)="addEvent($event)">
        </div>
      </div>
      <ng-template #dayOptions>
        <option value="">{{'SDK.DatePicker.Day' | translate}}</option>
        <option *ngFor="let day of daysInMonth" [value]="day">
          {{ day }}
        </option>
      </ng-template>
      <ng-template #monthOptions>
        <option value="">{{'SDK.DatePicker.Month' | translate}}</option>
        <option value="1">{{'SDK.DatePicker.January' | translate}}</option>
        <option value="2">{{'SDK.DatePicker.February' | translate}}</option>
        <option value="3">{{'SDK.DatePicker.March' | translate}}</option>
        <option value="4">{{'SDK.DatePicker.April' | translate}}</option>
        <option value="5">{{'SDK.DatePicker.May' | translate}}</option>
        <option value="6">{{'SDK.DatePicker.June' | translate}}</option>
        <option value="7">{{'SDK.DatePicker.July' | translate}}</option>
        <option value="8">{{'SDK.DatePicker.August' | translate}}</option>
        <option value="9">{{'SDK.DatePicker.September' | translate}}</option>
        <option value="10">{{'SDK.DatePicker.October' | translate}}</option>
        <option value="11">{{'SDK.DatePicker.November' | translate}}</option>
        <option value="12">{{'SDK.DatePicker.December' | translate}}</option>
      </ng-template>
      <ng-template #yearOptions>
        <option value="">{{'SDK.DatePicker.Year' | translate}}</option>
        <option *ngFor="let year of years" [value]="year">
          {{ year }}
        </option>
      </ng-template>
    `,
    styles: [`
    .date-text {
        padding: 0;
        margin: 0;
    }
    .two-char-input {
        width: 2.4em;
        padding: 0 2px 0 0;
    }
    .four-char-input {
        width: 3.5em;
        padding: 0 2px 0 0;
    }
    .date-field {
        flex-grow: 1;
    }

    .picklist {
        overflow: hidden;
        display: flex;
    }`]
})
export class DatePickerComponent implements OnChanges {
    @Input() label: string;
    @Input() readonly: boolean;
    @Input() placeholder: string;
    @Input() validationRequested: boolean;
    @Input() renderMode: DateRenderMode;
    @Input() showCalendar: boolean;
    @Input() dateFields: Array<string> = ['MM', 'DD', 'YYYY'];
    @Input() startYear: number | null;
    @Input() endYear: number | null;
    @Input() dateValue: DatePickerValue | null;
    @Output() valueChanged: EventEmitter<DatePickerValue | null> = new EventEmitter<DatePickerValue | null>();
    @ViewChild('MM', { static: false }) private MM;
    @ViewChild('DD', { static: false }) private DD;
    @ViewChild('YYYY', { static: false }) private YYYY;
    public daysInMonth: Array<number> = Array.from(new Array(31), (x, i) => i + 1);
    public years: Array<number>;
    public selectedMonth: string;
    public selectedDay: string;
    public selectedYear: string;
    private cachedDate: Date | null = null;

    // NOTE: internal dates stored in "selected" or "DatePickerValue" have month in range [1, 12].
    // Converting from/to "Date" needs to +/- 1 appropriately.
    constructor(
        private renderer: Renderer2,
        private dateService: DateService) { }

    public ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
        for (const propName in changes) {
            if (propName === 'dateValue') {
                if (this.dateValue != null) {
                    // Only update if the values are not the same, so we keep whatever user has written.
                    // I.e. if user has written "03" and new value is 3, no need to change it.
                    if (this.selectedDay) {
                        const current = parseInt(this.selectedDay, 10);
                        if (current !== this.dateValue.day) {
                            this.selectedDay = this.dateValue.day ? this.dateValue.day.toString() : '';
                        }
                    } else {
                        this.selectedDay = this.dateValue.day ? this.dateValue.day.toString() : '';
                    }

                    if (this.selectedMonth) {
                        const current = parseInt(this.selectedMonth, 10);
                        if (current !== this.dateValue.month) {
                            this.selectedMonth = this.dateValue.month ? this.dateValue.month.toString() : '';
                        }
                    } else {
                        this.selectedMonth = this.dateValue.month ? this.dateValue.month.toString() : '';
                    }

                    if (this.selectedYear) {
                        const current = parseInt(this.selectedYear, 10);
                        if (current !== this.dateValue.year) {
                            this.selectedYear = this.dateValue.year ? this.dateValue.year.toString() : '';
                        }
                    } else {
                        this.selectedYear = this.dateValue.year ? this.dateValue.year.toString() : '';
                    }

                    if (this.renderMode === DateRenderMode.Text) {
                        this.formatDate();
                    }
                }
            } else if (propName === 'startYear' || propName === 'endYear') {
                if (this.startYear && this.endYear) {
                    const start: number = this.startYear;
                    const end: number = this.endYear;
                    this.years = Array.from(Array(end - start + 1).keys()).map(x => x + start).reverse();
                }
            }
        }
    }

    public get singleDate(): Date | null {
        // Returning a new Date everytime messes up Angular's change
        // detection, keeps polling for new changes and locks up browser
        // caching the computed date and updated only if new info available
        const updatedDate = this.buildDateFromInputs();
        if (updatedDate === null && this.cachedDate !== null) {
            this.cachedDate = null;
        } else if (updatedDate !== null && this.cachedDate === null) {
            this.cachedDate = updatedDate;
        } else if (updatedDate !== null && this.cachedDate !== null) {
            if (updatedDate.getTime() !== this.cachedDate.getTime()) {
                this.cachedDate = updatedDate;
            }
        }
        return this.cachedDate;
    }

    public set singleDate(value: Date | null) {
        if (value != null) {
            const year = value.getFullYear();
            const month = value.getMonth() + 1;
            const day = value.getDate();
            this.selectedMonth = month.toString();
            this.selectedDay = day.toString();
            this.selectedYear = year.toString();
            this.emitValue(year, month, day);
        }
    }

    public get minDate(): Date | null {
        if (this.startYear === null) {
            return null;
        } else {
            return new Date(this.startYear, 1, 1);
        }
    }

    public get maxDate(): Date | null {
        if (this.endYear === null) {
            return null;
        } else {
            return new Date(this.endYear, 11, 31);
        }
    }

    public get dropdownYear(): number | string {
        return (this.selectedYear ? parseInt(this.selectedYear, 10) : '');
    }

    // Set the selected year by normalizing to empty string if value is falsey (i.e. null, undefined, etc).
    public set dropdownYear(value: number | string) {
        this.selectedYear = (value ? value.toString() : '');
    }

    public get dropdownMonth(): number | string {
        return (this.selectedMonth ? parseInt(this.selectedMonth, 10) : '');
    }

    // Set the selected month by normalizing to empty string if value is falsey.
    // Note: the type is `string` since the `value` html attribute was set instead of the Angular input directive.
    public set dropdownMonth(value: number | string) {
        this.selectedMonth = (value ? value.toString() : '');
    }

    public get dropdownDay(): number | string {
        return (this.selectedDay ? parseInt(this.selectedDay, 10) : '');
    }

    // Set the selected day by normalizing to empty string if value is falsey.
    public set dropdownDay(value: number | string) {
        this.selectedDay = (value ? value.toString() : '');
    }

    public inputChanged(): void {
        const valueToEmit = {
            month: this.includeMonthField() ? (this.selectedMonth ? parseInt(this.selectedMonth, 10) : null) : null,
            day: this.includeDayField() ? (this.selectedDay ? parseInt(this.selectedDay, 10) : null) : null,
            year: this.includeYearField() ? (this.selectedYear ? parseInt(this.selectedYear, 10) : null) : null
        };
        this.valueChanged.emit(valueToEmit);
    }

    public addEvent(event: MatDatepickerInputEvent<Date>): void {
        if (event && event.value) {
            const calendarDate: Date = event.value;
            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth() + 1;
            const day = calendarDate.getDate();
            if (this.dateService.checkExistingDate(year, month, day)) {
                this.selectedMonth = month.toString();
                this.selectedDay = day.toString();
                this.selectedYear = year.toString();
                this.emitValue(year, month, day);
            }
        }
    }

    public moveFocus(value: string, field: string): void {
        if (value.length === field.length) {
            const index = this.dateFields.findIndex((item) => {
                return field === item;
            });
            const nextIndex = index + 1;
            if (this.dateFields[nextIndex]) {
                const item = this.dateFields[nextIndex];
                this.renderer.selectRootElement(this[item].nativeElement).focus();
            }
        }
    }

    public formatDate(): void {
        const shouldAutoformat = (value: string) => parseInt(value, 10) >= 1 && parseInt(value, 10) <= 9;
        const addZero = (value: string) => ('0' + value).slice(-2);
        if (shouldAutoformat(this.selectedMonth)) {
            this.selectedMonth = addZero(this.selectedMonth);
        }
        if (shouldAutoformat(this.selectedDay)) {
            this.selectedDay = addZero(this.selectedDay);
        }
    }

    private emitValue(year: number, month: number, day: number): void {
        const valueToEmit = {
            year: this.includeYearField() ? year : null,
            month: this.includeMonthField() ? month : null,
            day: this.includeDayField() ? day : null,
        };
        this.valueChanged.emit(valueToEmit);
    }

    private includeMonthField(): boolean {
        return this.includeDateField('MM');
    }

    private includeDayField(): boolean {
        return this.includeDateField('DD');
    }

    private includeYearField(): boolean {
        return this.includeDateField('YYYY');
    }

    private includeDateField(fieldAbbrev: string): boolean {
        return this.renderMode === DateRenderMode.SingleText || this.dateFields.includes(fieldAbbrev);
    }

    private buildDateFromInputs(): Date | null {
        let month: any;
        let day: any;
        let year: any;
        if (this.selectedMonth) {
            month = parseInt(this.selectedMonth, 10);
        } else {
            return null;
        }
        if (this.selectedDay) {
            day = parseInt(this.selectedDay, 10);
        } else {
            return null;
        }
        if (this.selectedYear) {
            year = parseInt(this.selectedYear, 10);
        } else {
            return null;
        }
        if (this.dateService.checkExistingDate(year, month, day)) {
            // JavaScript Date uses 0 for January, 11 for December
            return new Date(year, month - 1, day);
        } else {
            return null;
        }
    }
    public floatLabelType(): string | null {
      return this.label ? 'always' : null;
    }
}
