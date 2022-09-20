import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {DashboardStatisticsService} from '../services/dashboard-statistics.service';
import {RoleService} from '../services/role.service';

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss']
})

export class DashboardStatisticsComponent implements OnInit {
  Charts: Observable<any>;
  hasRequiredRole;

  constructor(private dashboardStatisticsService: DashboardStatisticsService, private roleService: RoleService) {
  }

  ngOnInit(): void {
    this.hasRequiredRole = this.roleService.allowedToViewEELData();
    this.Charts = this.dashboardStatisticsService.ChartFactory();
  }

  get getConfiguration(): any {
    return {
      responsive: true,
      scrollZoom: true,
      displaylogo: false
    };
  }
}
