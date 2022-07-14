import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {DashboardStoreService} from "../../../STORE/Dashboard/dashboardStore.service";

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class NewDashboardComponent implements OnInit {
    Charts: Observable<any>;

    constructor(private dashboardStoreService: DashboardStoreService) {
    }

    ngOnInit() {
      this.Charts = this.dashboardStoreService.getDashboard;
    }
}
