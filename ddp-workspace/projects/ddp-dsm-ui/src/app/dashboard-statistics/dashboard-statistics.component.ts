import {Component, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';
import {catchError, finalize} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {CountsModel} from './models/Counts.model';
import {DateRangeModel} from "./models/DateRange.model";
import {DatePipe} from "@angular/common";

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

  constructor(
    private dashboardStatisticsService: DashboardStatisticsService,
    private roleService: RoleService,
  ) {
  }

  ngOnInit(): void {
    this.hasRequiredRole = this.roleService.allowedToViewEELData();
    this.Charts = this.dashboardStatisticsService.ChartFactory()
      .pipe(catchError(this.catchErrorAndReturnArray.bind(this)), finalize(() => this.loading = false));
    this.Counts = this.dashboardStatisticsService.Counts;
  }

  public dateChanged(date: any): void {
    // this.loading = true;
    setTimeout(() => {
      console.log(date)
      this.loading = false
    }, )
  }

  get getConfiguration(): any {
    return {
      responsive: true,
      displaylogo: false
    };
  }

  public get activeDates(): DateRangeModel {
    return {startDate: new Date(), endDate: new Date()}
  }

  private catchErrorAndReturnArray(error: HttpErrorResponse): [] {
    this.errorMessage.next(error);
    return [];
  }
}
