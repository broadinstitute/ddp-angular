import {Component, OnDestroy, OnInit} from '@angular/core';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {catchError, finalize, map, switchMap, take} from 'rxjs/operators';
import {ICount} from './interfaces/ICount';
import {DatePipe} from '@angular/common';
import {IDateRange} from './interfaces/IDateRange';
import {StatisticsEnum} from './enums/statistics.enum';
import {EMPTY, Observable, Subject, Subscription, tap} from 'rxjs';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ErrorsService} from '../services/errors.service';
import {Plotly} from 'angular-plotly.js/lib/plotly.interface';


interface IStatistics {
  name: string;
  matIconName: string;
  data: any;
}

interface IErrorHas {
  charts: boolean;
  counts: boolean;
}

type StatisticsTypes = 'charts' | 'counts';



@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss'],
  providers: [DatePipe]
})
export class DashboardStatisticsComponent implements OnInit, OnDestroy {
  /**
   * If there is any other type of statistics, just add here
   */
  public readonly statisticsCollection: IStatistics[] = [
    {name: 'charts', matIconName: 'bar_chart', data: null},
    {name: 'counts', matIconName: 'score', data: null}
  ];

  /**
   * If you need to display error for particular type of
   * statistics, just add in this object
   */
  public errorHas: IErrorHas = {charts: false, counts: false};

  public dateRange: IDateRange = {startDate: null, endDate: null};
  public loading = false;

  /**
   * Add here name of the statistics you want to be selected
   * and initialized for the first time
   */
  private activeTab: StatisticsTypes = 'counts';
  private isDateChanged = false;

  private readonly statisticsSubject$: Subject<void> = new Subject<void>();
  private readonly statisticsSubjectSubscription$: Subscription;

  constructor(private dashboardStatisticsService: DashboardStatisticsService, private errorService: ErrorsService) {
    this.statisticsSubjectSubscription$ = this.statisticsSubject$
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
        )
      )
      .subscribe({next: this.initializeData.bind(this)});
  }

  ngOnInit(): void {
    this.statisticsSubject$.next();
  }

  ngOnDestroy(): void {
    this.statisticsSubjectSubscription$.unsubscribe();
  }

  public getStatisticsFor({tab}: MatTabChangeEvent): void {
    this.activeTab = tab.ariaLabel as StatisticsTypes;
    if(this.allowStatisticsUpdate) {
      this.statisticsSubject$.next();
      this.isDateChanged = false;
    }
  }

  public dateChanged(dateRange: IDateRange): void {
    this.loading = true;
    this.isDateChanged = true;
    this.dateRange = dateRange;
    this.statisticsSubject$.next();
  }

  public retry(): void {
    this.loading = true;
    this.statisticsSubject$.next();
  }

  public get selectedTabIndex() {
    return this.statisticsCollection.findIndex(statistics => statistics.name === this.activeTab)
  }

  private get allowStatisticsUpdate(): boolean {
    return (!this.activeTabsObject.data || this.isDateChanged || this.errorHas[this.activeTab]) && !this.loading;
  }

  private get enumeratedActiveTab(): StatisticsEnum {
    return StatisticsEnum[this.activeTab.slice(0, this.activeTab.length - 1).toUpperCase()];
  }

  private initializeData(countsOrCharts: ICount | Plotly.Data): void {
    this.errorHas[this.activeTab] = false;
    const activeTab = this.activeTabsObject;
    activeTab.data = countsOrCharts;
    this.errorService.dismiss();
  }

  private get activeTabsObject(): IStatistics {
    return this.statisticsCollection.find(statistics => statistics.name === this.activeTab)
  }

  private handleError(_: any): Observable<never> {
    this.errorHas[this.activeTab] = true;
    return EMPTY;
  }

}
