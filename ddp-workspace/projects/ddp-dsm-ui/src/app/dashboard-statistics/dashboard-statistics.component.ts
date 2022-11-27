import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {catchError, finalize, map, switchMap, takeUntil} from 'rxjs/operators';
import {ICount} from './interfaces/ICount';
import {DatePipe} from '@angular/common';
import {IDateRange} from './interfaces/IDateRange';
import {StatisticsEnum} from "./enums/statistics.enum";
import {BehaviorSubject, of, Subject, tap} from 'rxjs';
import {MatTabChangeEvent} from "@angular/material/tabs";


type ChartsOrCounts = 'charts' | 'counts';

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss'],
  providers: [DatePipe]
})
export class DashboardStatisticsComponent implements OnInit, OnDestroy {
  public charts: any;
  public counts: ICount[];

  public dateRange: IDateRange = {startDate: null, endDate: null};
  public loading = false;

  private activeTab: ChartsOrCounts = 'charts';
  private isDateChanged = false;

  private statistics = new BehaviorSubject<ChartsOrCounts>(this.activeTab);
  private destroy$ = new Subject<void>();

  constructor(private dashboardStatisticsService: DashboardStatisticsService) {}

  ngOnInit(): void {
    this.statistics
      .pipe(
        tap(() => this.loading = true),
        map((chartsOrCounts: ChartsOrCounts) =>
          StatisticsEnum[chartsOrCounts.slice(0, chartsOrCounts.length - 1).toUpperCase()]),
        switchMap((statistics: StatisticsEnum) =>
          this.dashboardStatisticsService.getStatisticsFor(statistics, this.dateRange)
            .pipe(catchError(error => of(error)), finalize(() => this.loading = false))
        ),
        takeUntil(this.destroy$),
      )
      .subscribe({next: countsOrCharts => this[this.activeTab] = countsOrCharts})
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getStatisticsFor({tab}: MatTabChangeEvent) {
    const selectedTab = tab.ariaLabel.toLowerCase() as ChartsOrCounts;
    if(this.allowStatisticsUpdate(selectedTab)) {
      this.activeTab = selectedTab;
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

  private allowStatisticsUpdate(selectedTab: string): boolean {
    return (!this[selectedTab]?.length || this.isDateChanged) && !this.loading
  }

}
