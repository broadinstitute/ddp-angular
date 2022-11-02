import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {DateRangeModel} from "../../models/DateRange.model";
import {Subject} from "rxjs";
import {takeUntil, debounceTime} from 'rxjs/operators'
import {DatePipe} from "@angular/common";
import {DateRange} from "../../models/DateRange";

@Component({
  selector: 'app-date-range',
  templateUrl: 'date-range.component.html',
  styleUrls: ['date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeComponent implements OnInit, OnDestroy {
  public dateRangeForm: FormGroup;

  private readonly DATE_FORMAT_TRANSFORMED = 'MM/d/YYYY';
  private readonly destroyed$ = new Subject<void>();

  constructor(private datePipe: DatePipe) {
  }

  @Input('activeDates') set activeDates(dates: DateRange) {
    if(!this.dateRangeForm) {
      this.dateRangeForm = this.generateFormGroup(dates);
    }
  }
  @Output() dateChanged = new EventEmitter<DateRangeModel>();


  ngOnInit(): void {
    this.dateRangeForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroyed$))
      .subscribe((dates: DateRangeModel) => this.emitDateChange(dates))
  }

  public getEntries(object: object): [string, any][] {
    return Object.entries(object);
  }

  public get erroredFormControlsEntries(): [string, AbstractControl][] {
    return this.getEntries(this.dateRangeForm.controls)
      .filter(([_, value]: [string, AbstractControl]) => value.errors);
  }

  private emitDateChange(dates: DateRangeModel): void {
    if(this.dateRangeForm.get('startDate').valid && this.dateRangeForm.get('endDate').valid) {
      const formattedDate: DateRangeModel = new DateRange(
        this.datePipe.transform(dates.startDate, this.DATE_FORMAT_TRANSFORMED),
        this.datePipe.transform(dates.endDate, this.DATE_FORMAT_TRANSFORMED)
      )

      this.dateChanged.emit(formattedDate);
    }
  }

  private generateFormGroup({startDate, endDate}: DateRange = {startDate: null, endDate: null}): FormGroup {
    return new FormGroup({
      startDate: new FormControl(startDate || null, Validators.required),
      endDate: new FormControl(endDate || null, Validators.required),
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
  }

}
