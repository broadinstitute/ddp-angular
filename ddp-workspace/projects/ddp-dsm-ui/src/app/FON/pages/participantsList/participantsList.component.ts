import {Component, OnInit} from "@angular/core";
import {map, take, tap} from "rxjs/operators";
import {DSMService} from "../../../services/dsm.service";
import {patientListModel} from "./models/participantList.model";
import {ActivatedRoute, ActivatedRouteSnapshot, Params, Router} from "@angular/router";
import {Observable} from "rxjs";
import {AgentService, Patients} from "../../services/agent.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-participantsLit',
  templateUrl: './participantsList.component.html',
  styleUrls: ['./participantsList.component.css']
})

export class ParticipantsListComponent implements OnInit {
  patients$: Observable<patientListModel[]>;
  totalCount$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private agent: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.patients$ = this.agent.getPatients();
    this.totalCount$ = this.agent.getPatientsTotalCount();
    this.loading$ = this.agent.isLoading();

    this.router.navigate([], {queryParams: {from: 0, to: 10}})

    this.activatedRoute.queryParams.subscribe(({from, to}:Params) => this.agent.setPage(from, to))
  }

  setPage(event: PageEvent) {
    const from = ((event.pageIndex + 1) * event.pageSize) - event.pageSize ;
    const to = from + event.pageSize;
    this.router.navigate([], {queryParams: {from, to}})
  }


  openActivities(id: string) {
    this.router.navigate(['../patient', id], {relativeTo: this.activatedRoute})
  }

}
