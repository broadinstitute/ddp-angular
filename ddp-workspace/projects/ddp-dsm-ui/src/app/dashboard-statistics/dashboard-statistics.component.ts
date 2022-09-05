import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {DashboardStatisticsService} from "../services/dashboard-statistics.service";

@Component({
  selector: 'app-dashboard-statistics',
  templateUrl: './dashboard-statistics.component.html',
  styleUrls: ['./dashboard-statistics.component.scss']
})

export class DashboardStatisticsComponent implements OnInit {
  Charts: Observable<any>;

  constructor(private dashboardStatisticsService: DashboardStatisticsService) {
  }

  ngOnInit() {
  }
}
