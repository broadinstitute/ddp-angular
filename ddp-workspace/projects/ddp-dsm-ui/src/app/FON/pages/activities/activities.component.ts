import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {Observable, tap} from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { patientListModel } from '../participantsList/models/participantList.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class ActivitiesComponent implements OnInit {
  patientWithActivities: Observable<any>;
  panelOpenState = true;
  loading$: Observable<boolean>;


  constructor(private agent: AgentService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.patientWithActivities = this.agent.getActivityInstances(params.guid).pipe(tap(data => {
        !data && this.agent.getAll().subscribe()
      }));
    });
    this.loading$ = this.agent.isLoading();
  }

  navigate($event: any): void {
    console.log('navigate');
  }
}
