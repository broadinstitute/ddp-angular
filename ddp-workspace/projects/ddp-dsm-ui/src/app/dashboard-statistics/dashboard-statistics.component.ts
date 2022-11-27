import {Component, OnInit} from '@angular/core';
import {Observable, Subject, tap} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';
import {finalize} from 'rxjs/operators';
import {ICounts} from './interfaces/ICounts';
import {DatePipe} from '@angular/common';
import {IDateRange} from './interfaces/IDateRange';

/**
 * @TODO refactor this component and write unit tests
 */
@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss'],
  providers: [DatePipe]
})

export class DashboardStatisticsComponent implements OnInit {
  charts$: Observable<any>;
  counts$: Observable<ICounts[]>;
  dateRange: IDateRange = {startDate: null, endDate: null};
  loading = false;
  hasRequiredRole: boolean = this.roleService.allowedToViewEELData();

  errorMessage = new Subject();



  constructor(
    private dashboardStatisticsService: DashboardStatisticsService,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.charts$ = this.dashboardStatisticsService.ChartFactory(this.dateRange)
      .pipe(finalize(() => this.loading = false), tap(() => console.log("SUBSCRIBED")));
    this.counts$ = this.dashboardStatisticsService.CountsFactory(this.dateRange);
  }

  public dateChanged(dateRange: IDateRange): void {
    if(navigator.onLine) {
      this.loading = true;
    }
    this.dateRange = dateRange;
    this.initData();
  }


}
