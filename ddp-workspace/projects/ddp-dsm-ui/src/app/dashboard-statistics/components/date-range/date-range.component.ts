import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {DateRangeModel} from '../../models/DateRange.model';
import {Subject} from 'rxjs';
import {takeUntil, auditTime} from 'rxjs/operators';
import {DatePipe} from '@angular/common';
import {Global} from '../../../globals/globals';

@Component({
  selector: 'app-date-range',
  templateUrl: 'date-range.component.html',
  styleUrls: ['date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent implements OnInit, OnDestroy {
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
  }

  public getEntries(object: object): [string, any][] {
    return Object.entries(object);
  }

  public get erroredFormControlsEntries(): [string, ValidationErrors][] {
    return this.getEntries(this.formControls)
      .reduce(this.filterErroredEntries, []);
  }

  private initDateRangeForm(): void {
    if(this.isActiveDateOnInitRangeObject) {
      this.dateRangeForm.patchValue(this.initDates, {emitEvent: false});
    }
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
    result: [string, ValidationErrors][],
    [key, value]: [string, AbstractControl]): [string, ValidationErrors][] {
      value.errors && result.push([key, value.errors]);
      return result;
  }

  private emitDateChange(dates: DateRangeModel): void {
    this.dateRangeForm.valid && this.dateChanged.emit(this.getTransformedDates(dates));
  }

  private getTransformedDates(dates: DateRangeModel): DateRangeModel {
    return {
      startDate: this.datePipe.transform(dates.startDate, Global.DATE_FORMAT),
      endDate: this.datePipe.transform(dates.endDate, Global.DATE_FORMAT)
    };
  }

  private get isActiveDateOnInitRangeObject(): boolean {
    const requiredProperties: string[] = ['startDate', 'endDate'];
    /**
     * Here we are using .some() method on purpose
     */
    return this.initDates
      && this.initDates instanceof Object
      && requiredProperties.some((prop: string) => this.initDates.hasOwnProperty(prop));
  }

  private get formControls(): {[key: string]: AbstractControl} {
    return this.dateRangeForm.controls;
  }

}
