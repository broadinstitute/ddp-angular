import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import {Observable, tap} from 'rxjs';
import { patientListModel } from './models/patient-list.model';

import {MainConstants} from '../../constants/main-constants';
import {StoreService} from '../../../STORE/store.service';
import {
  RegisterPatientsModalComponent
} from '../../components/register-patients-modal/register-patients-modal.component';
import { SearchPatientDataModel } from './models/search-patient-data.model';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})

export class PatientsListComponent implements OnInit {
  private readonly LSParams: string = 'pListQueryParams';
  readonly PARENT = MainConstants.participantsList;

  pageIndex = 1;
  pageSize: number;
  isSearchPanelShown: boolean;
  registerPatientsModalComponent = RegisterPatientsModalComponent;

  patients$: Observable<patientListModel[]>;
  totalCount$: Observable<number>;
  loading$: Observable<boolean>;

  DEFAULT_FROM_VALUE = 0;
  DEFAULT_TO_VALUE = 10;

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
    const params = {from: qParams?.from || this.DEFAULT_FROM_VALUE, to: qParams?.to || this.DEFAULT_TO_VALUE};
    
    this.setToLocalStorage(params);

    this.router.navigate([],
      {queryParams: params}
    );

    this.activatedRoute.queryParams
      .pipe(
        tap((params: Params) => {
          this.pageSize = params.to - params.from || 10;
          this.pageIndex = (params.to/this.pageSize) || 1;
          this.patients$ = this.storeService.getParticipants(params.from, params.to, this.PARENT);
        })
      )
      .subscribe();
  }

  public openPatientInfo({guid}: patientListModel): void {
    this.router.navigate([guid], {
      relativeTo: this.activatedRoute
    });
  }

  public getPageList({from, to}: any): void {
    this.setToLocalStorage({from, to});
    this.router.navigate([], {queryParams: {from, to}});
  }

  private setToLocalStorage(item: any): void {
    localStorage.setItem(this.LSParams, JSON.stringify(item));
  }

  searchPatients(data: SearchPatientDataModel): void {
    console.log('Search patients:', data);

    // TODO: add table sorting logic by search data here
  }
}
