import { Component, OnInit } from '@angular/core';
import { patientListModel } from './models/patient-list.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Observable, tap} from 'rxjs';
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
  private readonly LSParams: string = 'pListQueryParams';
  readonly PARENT = MainConstants.participantsList;

  registerPatientsModalComponent = RegisterPatientsModalComponent;

  patients$: Observable<patientListModel[]>;
  totalCount$: Observable<number>;
  loading$: Observable<boolean>;

  pageIndex = 1;
  pageSize: number;


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
    this.setToLocalStorage({from: qParams?.from || 0, to: qParams?.to || 10});

    this.router.navigate([],
      {queryParams: {from: qParams?.from || 0, to: qParams?.to || 10}}
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

}
