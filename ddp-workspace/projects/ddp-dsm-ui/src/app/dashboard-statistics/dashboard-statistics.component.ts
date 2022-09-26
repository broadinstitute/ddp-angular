import {Component, ElementRef, OnInit} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';
import {finalize} from 'rxjs/operators';
import {dashboardType} from "../enums/dashboard.enums";

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss']
})

export class DashboardStatisticsComponent implements OnInit {
  Charts: Observable<any>;
  Counts: Observable<any>;
  hasRequiredRole;
  loading = true;

  constructor(private dashboardStatisticsService: DashboardStatisticsService, private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.hasRequiredRole = this.roleService.allowedToViewEELData();
    this.Charts = this.dashboardStatisticsService.ChartFactory().pipe(finalize(() => this.loading = false));
    this.Counts = this.dashboardStatisticsService.Counts;
  }

  get getConfiguration(): any {
    return {
      responsive: true,
      displaylogo: false
    };
  }

  public scrollToVew(divElement: HTMLDivElement): void {
    divElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    })
  }
}
