import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {DateRangeModel} from '../../models/DateRange.model';
import {Subject} from 'rxjs';
import {takeUntil, auditTime} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {DateRangeErrorModel} from '../../models/DateRangeError.model';

type startOrEndDate = 'startDate' | 'endDate';

@Component({
  selector: 'app-date-range',
  templateUrl: 'date-range.component.html',
  styleUrls: ['date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent implements OnInit, OnDestroy {
  private readonly OUTPUT_DATE_FORMAT = 'YYYY-MM-dd';

  /**
   * @MAIN Main Date Range Object
   */
  public readonly dateRangeForm: FormGroup =  new FormGroup({
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
  });

  private readonly destroyed$: Subject<void> = new Subject<void>();

  constructor(private datePipe: DatePipe) {
  }

  @Input() initDates: DateRangeModel;

  @Input('disabled') set disabledState(isDisabled: boolean) {
    const options = {emitEvent: false};
    isDisabled ? this.dateRangeForm.disable(options) : this.dateRangeForm.enable(options);
  }

  @Output() dateChanged = new EventEmitter<DateRangeModel>();


  ngOnInit(): void {
    this.initDateRangeForm();
    this.listenToValueChangesAndEmit();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public get dateRangeErrors(): DateRangeErrorModel {
    return Object.entries(this.formControls)
      .reduce(this.filterErroredEntries, {startDate: [], endDate: []});
  }

  public clearDatesAndEmit(): void {
    this.dateRangeForm.reset();
    this.dateChanged.emit({startDate: null, endDate: null});
  }

  public get isPristine(): boolean {
    return this.dateRangeForm.pristine;
  }

  private initDateRangeForm(): void {
    this.dateRangeForm.patchValue(this.initDates, {emitEvent: false});
  }

  private listenToValueChangesAndEmit(): void {
    /**
     * Here is used auditTime operator, due to known bug in Angular material:
     * Discussion: https://github.com/angular/components/issues/19776
     */
    this.dateRangeForm.valueChanges
      .pipe(auditTime(0), takeUntil(this.destroyed$))
      .subscribe((dates: DateRangeModel) => this.emitDateChange(dates));
  }

  private filterErroredEntries(
    result: DateRangeErrorModel,
    [key, value]: [startOrEndDate, AbstractControl]): DateRangeErrorModel {
      value.errors && result[key].push(...Object.keys(value.errors));
      return result;
  }

  private emitDateChange(dates: DateRangeModel): void {
    this.dateRangeForm.valid && this.dateChanged.emit(this.getTransformedDates(dates));
  }

  private getTransformedDates(dates: DateRangeModel): DateRangeModel {
    return {
      startDate: this.datePipe.transform(dates.startDate, this.OUTPUT_DATE_FORMAT),
      endDate: this.datePipe.transform(dates.endDate, this.OUTPUT_DATE_FORMAT)
    };
  }

  private get formControls(): {[key: string]: AbstractControl} {
    return this.dateRangeForm.controls;
  }

}