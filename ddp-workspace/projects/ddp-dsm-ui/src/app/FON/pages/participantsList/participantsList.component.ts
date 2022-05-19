import { Component, OnInit } from '@angular/core';
import { patientListModel } from './models/participantList.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-participants-list',
  templateUrl: './participantsList.component.html',
  styleUrls: ['./participantsList.component.scss']
})

export class ParticipantsListComponent implements OnInit {
  patients$: Observable<patientListModel[]>;
  totalCount$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private agent: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.patients$ = this.agent.getPatients();
    this.totalCount$ = this.agent.getPatientsTotalCount();
    this.loading$ = this.agent.isLoading();

    this.router.navigate([], {queryParams: {from: 0, to: 10}});

    this.activatedRoute.queryParams.subscribe(({from, to}: Params) => this.agent.setPage(from, to));
  }

  setPage(event: PageEvent): void {
    const from = ((event.pageIndex + 1) * event.pageSize) - event.pageSize;
    const to = from + event.pageSize;
    this.router.navigate([], {queryParams: {from, to}});
  }

  openActivities(participant: patientListModel): void {
    this.router.navigate(['../patient', participant.guid], {
      relativeTo: this.activatedRoute,
      state: { participant }
    });
  }
}
