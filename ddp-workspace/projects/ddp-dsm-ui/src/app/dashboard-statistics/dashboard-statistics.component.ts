import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {catchError, finalize, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {ICount} from './interfaces/ICount';
import {DatePipe} from '@angular/common';
import {IDateRange} from './interfaces/IDateRange';
import {StatisticsEnum} from "./enums/statistics.enum";
import {BehaviorSubject, EMPTY, Observable, Subject, tap} from 'rxjs';
import {MatTabChangeEvent} from "@angular/material/tabs";
import {ErrorsService} from "../services/errors.service";
import {Plotly} from "angular-plotly.js/lib/plotly.interface";


type ChartsOrCounts = 'charts' | 'counts';
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
  public loading = false;
  public errorHas: errorHas = {charts: false, counts: false};

  private activeTab: ChartsOrCounts = 'charts';
  private isDateChanged = false;

  private statistics = new BehaviorSubject<ChartsOrCounts>(this.activeTab);
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private dashboardStatisticsService: DashboardStatisticsService, private errorService: ErrorsService) {}

  ngOnInit(): void {
    this.statistics
      .pipe(
        tap(() => this.loading = true),
        map((chartsOrCounts: ChartsOrCounts) =>
          StatisticsEnum[chartsOrCounts.slice(0, chartsOrCounts.length - 1).toUpperCase()]),
        switchMap((statistics: StatisticsEnum) =>
          this.dashboardStatisticsService.getStatisticsFor(statistics, this.dateRange)
            .pipe(take(1), catchError(this.handleError.bind(this)), finalize(() => this.loading = false))
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({next: this.initializeData.bind(this)})
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getStatisticsFor({tab}: MatTabChangeEvent) {
    this.activeTab = tab.ariaLabel.toLowerCase() as ChartsOrCounts;
    if(this.allowStatisticsUpdate) {
      this.statistics.next(this.activeTab);
      this.isDateChanged = false;
    }
  }

  public dateChanged(dateRange: IDateRange): void {
    this.loading = true;
    this.isDateChanged = true;
    this.dateRange = dateRange;
    this.statistics.next(this.activeTab);
  }

  public retry(): void {
    this.loading = true;
    this.statistics.next(this.activeTab);
  }

  private get allowStatisticsUpdate(): boolean {
    return (!this[this.activeTab] || this.isDateChanged || this.errorHas[this.activeTab]) && !this.loading;
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
