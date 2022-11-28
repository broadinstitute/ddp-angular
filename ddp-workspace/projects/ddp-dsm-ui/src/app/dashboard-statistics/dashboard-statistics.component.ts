import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {catchError, finalize, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {ICount} from './interfaces/ICount';
import {DatePipe} from '@angular/common';
import {IDateRange} from './interfaces/IDateRange';
import {StatisticsEnum} from './enums/statistics.enum';
import {EMPTY, Observable, Subject, tap} from 'rxjs';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ErrorsService} from '../services/errors.service';
import {Plotly} from 'angular-plotly.js/lib/plotly.interface';


type StatisticsTypes = 'charts' | 'counts';
interface errorHas {
  charts: boolean;
  counts: boolean;
}

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss'],
  providers: [DatePipe]
})
export class DashboardStatisticsComponent implements OnInit, OnDestroy {
  public charts: Plotly.Data;
  public counts: ICount[];

  public dateRange: IDateRange = {startDate: null, endDate: null};
  public errorHas: errorHas = {charts: false, counts: false};
  public loading = false;

  private activeTab: StatisticsTypes = 'charts';
  private isDateChanged = false;

  private readonly statisticsSubject: Subject<void> = new Subject<void>();
  private readonly destroyStatisticsSubject$: Subject<void> = new Subject<void>();

  constructor(private dashboardStatisticsService: DashboardStatisticsService, private errorService: ErrorsService) {
    this.statisticsSubject
      .pipe(
        tap(() => this.loading = true),
        map(() => this.enumeratedActiveTab),
        switchMap((statisticsEnum: StatisticsEnum) =>
          this.dashboardStatisticsService.getStatisticsFor(statisticsEnum, this.dateRange)
            .pipe(
              take(1),
              catchError(this.handleError.bind(this)),
              finalize(() => this.loading = false)
            )
        ),
        takeUntil(this.destroyStatisticsSubject$),
      )
      .subscribe({next: this.initializeData.bind(this)});
  }

  ngOnInit(): void {
    this.statisticsSubject.next();
  }

  ngOnDestroy(): void {
    this.destroyStatisticsSubject$.next();
    this.destroyStatisticsSubject$.complete();
  }

  public getStatisticsFor({tab}: MatTabChangeEvent): void {
    this.activeTab = tab.ariaLabel as StatisticsTypes;
    if(this.allowStatisticsUpdate) {
      this.statisticsSubject.next();
      this.isDateChanged = false;
    }
  }

  public dateChanged(dateRange: IDateRange): void {
    this.loading = true;
    this.isDateChanged = true;
    this.dateRange = dateRange;
    this.statisticsSubject.next();
  }

  public retry(): void {
    this.loading = true;
    this.statisticsSubject.next();
  }

  private get allowStatisticsUpdate(): boolean {
    return (!this[this.activeTab] || this.isDateChanged || this.errorHas[this.activeTab]) && !this.loading;
  }

  private get enumeratedActiveTab(): StatisticsEnum {
    return StatisticsEnum[this.activeTab.slice(0, this.activeTab.length - 1).toUpperCase()];
  }

  private initializeData(countsOrCharts: ICount | Plotly.Data): void {
    this.errorHas[this.activeTab] = false;
    this[this.activeTab] = countsOrCharts;
    this.errorService.dismiss();
  }

  private handleError(_: any): Observable<never> {
    this.errorHas[this.activeTab] = true;
    return EMPTY;
  }

}
