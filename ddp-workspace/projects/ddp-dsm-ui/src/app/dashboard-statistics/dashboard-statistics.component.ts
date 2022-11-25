import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';
import {finalize} from 'rxjs/operators';
import {ICounts} from './interfaces/ICounts';
import {DatePipe} from '@angular/common';
import {IDateRange} from './interfaces/IDateRange';
import {OnLineService} from "../services/onLine.service";

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
  Charts: Observable<any>;
  Counts: Observable<ICounts[]>;
  errorMessage = new Subject();
  hasRequiredRole;
  loading = true;
  dateRange: IDateRange = {startDate: null, endDate: null};

  constructor(
    private dashboardStatisticsService: DashboardStatisticsService,
    private roleService: RoleService,
    private onLineService: OnLineService
  ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.hasRequiredRole = this.roleService.allowedToViewEELData();
    this.Charts = this.dashboardStatisticsService.ChartFactory(this.dateRange)
      .pipe(finalize(() => this.loading = false));
    this.Counts = this.dashboardStatisticsService.CountsFactory(this.dateRange);
  }

  public dateChanged(dateRange: IDateRange): void {
    if(this.onLineService.isOnline) {
      this.loading = true;
    }
    this.dateRange = dateRange;
    this.initData();
  }

  get getConfiguration(): any {
    return {
      responsive: true,
      displaylogo: false
    };
  }
}
