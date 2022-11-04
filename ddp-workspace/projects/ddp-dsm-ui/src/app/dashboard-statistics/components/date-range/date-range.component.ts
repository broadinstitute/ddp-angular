import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DateRangeModel} from "../../models/DateRange.model";
import {Subject} from "rxjs";
import {takeUntil, auditTime} from 'rxjs/operators'
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-date-range',
  templateUrl: 'date-range.component.html',
  styleUrls: ['date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent implements OnInit, OnDestroy {
  public dateRangeForm: FormGroup;

  private readonly DATE_FORMAT_TRANSFORMED: string = 'MM/d/YYYY';
  private readonly DEFAULT_DATE_RANGE: DateRangeModel = {startDate: null, endDate: null};

  private readonly destroyed$: Subject<void> = new Subject<void>();

  constructor(private datePipe: DatePipe) {
  }

  @Input('activeDates') set activeDates(dates: DateRangeModel) {
    this.SetDateRangeForm = dates;
  }
  @Input('disabled') set disabledState(disabled: boolean) {
    this.disableOrEnable(disabled);
  }

  @Output() dateChanged = new EventEmitter<DateRangeModel>();


  ngOnInit(): void {
    this.SetDateRangeForm = null;
    this.listenToValueChangesAndEmit();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public getEntries(object: object): [string, any][] {
    return Object.entries(object);
  }

  public get erroredFormControlsEntries(): [string, ValidationErrors][] {
    return this.getEntries(this.formControls)
      .filter(([_, value]: [string, AbstractControl]) => value.errors)
      .map(([key, value]) => [key, value.errors]);
  }

  private listenToValueChangesAndEmit(): void {
    /**
     * Here is used auditTime operator, due to known bug in Angular material:
     * Discussion: https://github.com/angular/components/issues/19776
     */
    this.dateRangeForm.valueChanges
      .pipe(auditTime(0), takeUntil(this.destroyed$))
      .subscribe((dates: DateRangeModel) => this.emitDateChange(dates))
  }

  private emitDateChange(dates: DateRangeModel): void {
    this.dateRangeForm.valid && this.dateChanged.emit(this.getTransformedDates(dates));
  }

  private getTransformedDates(dates: DateRangeModel): DateRangeModel {
    return {
      startDate: this.datePipe.transform(dates.startDate, this.DATE_FORMAT_TRANSFORMED),
      endDate: this.datePipe.transform(dates.endDate, this.DATE_FORMAT_TRANSFORMED)
    }
  }

  private generateFormGroup({startDate, endDate}: DateRangeModel): FormGroup {
    return new FormGroup({
      startDate: new FormControl({value: startDate || null, disabled: true}, Validators.required),
      endDate: new FormControl({value: endDate || null, disabled: true} || null, Validators.required),
    });
  }

  private isDateRangeObject(dateRange: DateRangeModel): boolean {
    const requiredProperties: string[] = ['startDate', 'endDate'];
    /**
     * Here we are using .some() method on purpose
     */
    return dateRange && dateRange instanceof Object && requiredProperties.some((prop: string) => dateRange.hasOwnProperty(prop));
  }

  private disableOrEnable(disable: boolean): void {
    if(this.dateRangeForm) {
      !!disable ? this.disable() : this.enable();
    }
  }

  private enable(): void {
    this.endDate.enable({emitEvent: false});
    this.startDate.enable({emitEvent: false});
  }

  private disable(): void {
    this.endDate.disable({emitEvent: false});
    this.startDate.disable({emitEvent: false});
  }

  private get formControls(): {[key: string]: AbstractControl} {
    return this.dateRangeForm.controls;
  }

  private get startDate(): AbstractControl {
    return this.dateRangeForm.get('startDate');
  }

  private get endDate(): AbstractControl {
    return this.dateRangeForm.get('endDate');
  }

  private set SetDateRangeForm(dateRange: DateRangeModel) {
    if(!this.dateRangeForm) {
      const dateRangeObject: DateRangeModel = this.isDateRangeObject(dateRange) ? dateRange : this.DEFAULT_DATE_RANGE;
      this.dateRangeForm = this.generateFormGroup(dateRangeObject);
    }
  }
}
