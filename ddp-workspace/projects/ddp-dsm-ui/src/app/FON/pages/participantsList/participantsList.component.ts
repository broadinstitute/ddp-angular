import { Component, OnInit } from '@angular/core';
import { patientListModel } from './models/participantList.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {Observable, tap} from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import {MainConstants} from '../../constants/main-constants';
import {StoreService} from '../../../STORE/store.service';
import {AddPatientsModalComponent} from "../../components/add-patients-modal/add-patients-modal.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-participants-list',
  templateUrl: './participantsList.component.html',
  styleUrls: ['./participantsList.component.scss']
})

export class ParticipantsListComponent implements OnInit {
  patients$: Observable<patientListModel[]>;
  totalCount$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string>;

  pageIndex: number;
  pageSize: number;
  readonly PARENT = MainConstants.participantsListParent;

  private readonly LSParams: string = 'pListQueryParams';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
    private matDialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.totalCount$ = this.storeService.getParticipantsTotalCount;
    this.loading$ = this.storeService.getParticipantsLoadingStatus;
    this.error$ = this.storeService.getErrorState;



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
    this.router.navigate(['../patient', participant.guid], {
      relativeTo: this.activatedRoute
    });
  }

  openAddPatientsModal() {
    const dialogRef = this.matDialog.open(AddPatientsModalComponent, {
      panelClass: 'matDialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result, 'from dialog close observer');
    });
  }
}
