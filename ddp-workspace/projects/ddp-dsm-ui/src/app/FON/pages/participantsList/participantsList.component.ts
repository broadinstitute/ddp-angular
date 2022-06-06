import { Component, OnInit } from '@angular/core';
import { patientListModel } from './models/participantList.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Observable, switchMap, tap} from 'rxjs';
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
  pageIndex: number;
  pageSize: number;

  private readonly LSParams: string = 'pListQueryParams';

  constructor(private agent: AgentService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.patients$ = this.agent.getPatients();
    this.totalCount$ = this.agent.getPatientsTotalCount();
    this.loading$ = this.agent.isLoading();

    const qParams = JSON.parse(localStorage.getItem(this.LSParams));

    localStorage.setItem(this.LSParams,
      JSON.stringify({from: qParams?.from || 0, to: qParams?.to || 10}));

    this.router.navigate([],
      {queryParams: {from: qParams?.from || 0, to: qParams?.to || 10}}
    );

    this.activatedRoute.queryParams
      .pipe(
        tap((params: Params) => {
          this.pageSize = params.to - params.from;
          this.pageIndex = (params.to/this.pageSize) - 1;
        }),
        switchMap((params: Params) => this.agent.setPage(params.from, params.to))
      )
      .subscribe();
  }

  setPage(event: PageEvent): void {
    const from = ((event.pageIndex + 1) * event.pageSize) - event.pageSize;
    const to = from + event.pageSize;

    localStorage.setItem(this.LSParams,
      JSON.stringify({from, to}));

    this.router.navigate([], {queryParams: {from, to}});
  }

  openActivities(participant: patientListModel): void {
    this.router.navigate(['../patient', participant.guid], {
      relativeTo: this.activatedRoute
    });
  }
}
