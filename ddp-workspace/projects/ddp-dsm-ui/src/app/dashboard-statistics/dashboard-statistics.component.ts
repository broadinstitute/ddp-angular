import {Component, OnInit} from '@angular/core';
import {EMPTY, Observable, Subject} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';
import {catchError, finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {CountsModel} from './models/Counts.model';
import {DatePipe} from '@angular/common';
import {DateRangeModel} from './models/DateRange.model';

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
  Counts: Observable<CountsModel[]>;
  errorMessage = new Subject();
  hasRequiredRole;
  loading = true;
  dateRange: DateRangeModel = {startDate: null, endDate: null};

  constructor(
    private dashboardStatisticsService: DashboardStatisticsService,
    private roleService: RoleService,
  ) {
  }

  ngOnInit(): void {
    this.initData();
  }

  private initData(): void {
    this.hasRequiredRole = this.roleService.allowedToViewEELData();
    this.Charts = this.dashboardStatisticsService.ChartFactory(this.dateRange)
      .pipe(catchError(this.catchErrorAndReturnArray.bind(this)), finalize(() => this.loading = false));
    this.Counts = this.dashboardStatisticsService.Counts;
  }

  public dateChanged(dateRange: DateRangeModel): void {
    console.log(dateRange, 'DATE - dashboard.statistics');
    this.loading = true;
    this.dateRange = dateRange;
    this.initData();
  }

  get getConfiguration(): any {
    return {
      responsive: true,
      displaylogo: false
    };
  }

  private catchErrorAndReturnArray(error: HttpErrorResponse): Observable<never> {
    if(error instanceof HttpErrorResponse) {
      this.errorMessage.next(error);
    }
    return EMPTY;
  }
}
