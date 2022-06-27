import { Component, OnInit } from '@angular/core';
import { patientListModel } from './models/patient-list.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Observable, tap} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {MainConstants} from '../../constants/main-constants';
import {StoreService} from '../../../STORE/store.service';
import {
  RegisterPatientsModalComponent
} from '../../components/register-patients-modal/register-patients-modal.component';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})

export class PatientsListComponent implements OnInit {
  patients$: Observable<patientListModel[]>;
  totalCount$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string>;

  // Modal section
  registerPatientsModalComponent = RegisterPatientsModalComponent;

  pageIndex: number;
  pageSize: number;
  readonly PARENT = MainConstants.participantsListParent;

  private readonly LSParams: string = 'pListQueryParams';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService
  ) {
  }

  ngOnInit(): void {
    this.totalCount$ = this.storeService.getParticipantsTotalCount;
    this.loading$ = this.storeService.getParticipantsLoadingStatus;



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
          this.patients$ = this.storeService.getParticipants(params.from, params.to, this.PARENT);
        })
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
    this.router.navigate([participant.guid], {
      relativeTo: this.activatedRoute
    });
  }

}
