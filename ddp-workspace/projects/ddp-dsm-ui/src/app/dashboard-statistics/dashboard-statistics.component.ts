import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss']
})

export class DashboardStatisticsComponent implements OnInit {
  Charts: Observable<any>;
  hasRequiredRole;
  loading: boolean = true;

  constructor(private dashboardStatisticsService: DashboardStatisticsService, private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.hasRequiredRole = this.roleService.allowedToViewEELData();
    this.Charts = this.dashboardStatisticsService.ChartFactory().pipe(finalize(() => this.loading = false));
  }

  get getConfiguration(): any {
    return {
      responsive: true,
      scrollZoom: true,
      displaylogo: false
    };
  }
}
