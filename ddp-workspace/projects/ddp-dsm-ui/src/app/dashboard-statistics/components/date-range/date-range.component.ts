import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DateRangeModel} from "../../models/DateRange.model";
import {DateValidationErrorMessages} from "../../pipes/date-error.messages";
import {Subject} from "rxjs";
import {takeUntil} from 'rxjs/operators'
import {DatePipe} from "@angular/common";
import {DateRange} from "../../models/DateRange";

@Component({
  selector: 'app-date-range',
  templateUrl: 'date-range.component.html',
  styleUrls: ['date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe]
})
export class DateRangeComponent implements OnInit, OnDestroy {
  private readonly DATE_FORMAT_TRANSFORMED = 'MM/d/YYYY';

  private readonly destroyed$ = new Subject<void>();

  @Output() dateChanged = new EventEmitter<DateRangeModel>();

  readonly dateRangeForm = new FormGroup({
    startDate: new FormControl(new Date().toISOString(), Validators.required),
    endDate: new FormControl(new Date().toISOString(), Validators.required),
  });

  constructor(private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.dateRangeForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe((dates: DateRangeModel) => this.emitDateChange(dates))
  }

  public getEntries(object: object): [string, any][] {
    return Object.entries(object || {});
  }

  public get erroredFormControlsEntries(): [string, AbstractControl][] {
    return this.getEntries(this.dateRangeForm.controls)
      .filter(([_, value]: [string, AbstractControl]) => value.errors);
  }

  private emitDateChange(dates: DateRangeModel): void {
    if(this.dateRangeForm.valid) {
      const formattedDate: DateRangeModel = new DateRange(
        this.datePipe.transform(dates.startDate, this.DATE_FORMAT_TRANSFORMED),
        this.datePipe.transform(dates.endDate, this.DATE_FORMAT_TRANSFORMED)
      )

      this.dateChanged.emit(formattedDate);
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
