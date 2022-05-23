import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {Observable, Subject, tap} from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { patientListModel } from '../participantsList/models/participantList.model';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class ActivitiesComponent implements OnInit, OnDestroy {
  patientWithActivities: Observable<any>;
  panelOpenState = true;
  loading$: Observable<boolean>;

  getAllObs = new Subject();


  constructor(private agent: AgentService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.patientWithActivities = this.agent.getActivityInstances(params.guid).pipe(tap(data => {
        !data && this.agent.getAll().pipe(takeUntil(this.getAllObs)).subscribe();
      }));
    });
    this.loading$ = this.agent.isLoading();
  }

  ngOnDestroy(): void {
    this.getAllObs.next(null);
  }

  navigate($event: any): void {
    console.log('navigate');
  }
}
