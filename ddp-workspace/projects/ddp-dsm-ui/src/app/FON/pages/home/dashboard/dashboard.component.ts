import {Component, OnInit} from "@angular/core";
import {DashboardService} from "../../../services/dashboard.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class FonDashboardComponent implements OnInit {

    Data: Observable<any>;
    Layout: any;

  public graph = {
    data: [{ x: [1, 2, 3], y: [2, 5, 3], type: 'bar' }],
    layout: {autosize: true, title: 'A Fancy Plot'},
  };

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
      this.Data = this.dashboardService.charts;
    }
}
