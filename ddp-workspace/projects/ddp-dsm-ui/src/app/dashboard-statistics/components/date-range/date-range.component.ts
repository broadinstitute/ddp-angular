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
  private readonly DATE_FORMAT_TRANSFORMED: string = 'MM/d/YYYY';

  /**
   * @MAIN Main Date Range Object
   */
  public readonly dateRangeForm: FormGroup = this.generateFormGroup;

  private readonly destroyed$: Subject<void> = new Subject<void>();

  constructor(private datePipe: DatePipe) {
  }

  @Input('activeDates') activeDatesOnInit: DateRangeModel;

  @Input('disabled') set disabledState(isDisabled: boolean) {
    if(typeof isDisabled === "boolean") {
      this.disableOrEnable = isDisabled;
    }
  }

  @Output() dateChanged = new EventEmitter<DateRangeModel>();


  ngOnInit(): void {
    this.initDateRangeForm();
    this.listenToValueChangesAndEmit();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

  public getEntries(object: object): [string, AbstractControl | ValidationErrors][] {
    return Object.entries(object);
  }

  public get erroredFormControlsEntries(): [string, ValidationErrors][] {
    return this.getEntries(this.formControls)
      .reduce(this.filterErroredEntries, []);
  }

  private filterErroredEntries(
    result: [string, ValidationErrors][],
    [key, value]: [string, AbstractControl])
    : [string, ValidationErrors][] {
      value.errors && result.push([key, value.errors]);
      return result;
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

  private initDateRangeForm() {
    if(this.isActiveDateOnInitRangeObject) {
      this.dateRangeForm.patchValue(this.activeDatesOnInit, {emitEvent: false})
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

  private get generateFormGroup(): FormGroup {
    return new FormGroup({
      startDate: new FormControl(null, Validators.required),
      endDate: new FormControl(null, Validators.required),
    });
  }

  private get isActiveDateOnInitRangeObject(): boolean {
    const requiredProperties: string[] = ['startDate', 'endDate'];
    /**
     * Here we are using .some() method on purpose
     */
    return this.activeDatesOnInit
      && this.activeDatesOnInit instanceof Object
      && requiredProperties.some((prop: string) => this.activeDatesOnInit.hasOwnProperty(prop));
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

  private set disableOrEnable(disable: boolean) {
    disable ? this.disable() : this.enable();
  }
}
