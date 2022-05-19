import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { patientListModel } from '../participantsList/models/participantList.model';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})

export class ActivitiesComponent implements OnInit {
  activityGuides: Observable<any>;
  panelOpenState: boolean = true;
  currentParticipant: patientListModel;

  constructor(private agent: AgentService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.activityGuides = this.agent.getActivityInstances(params.guid);
    });

    this.currentParticipant = window.history.state.participant;
  }

  navigate($event: any): void {
    console.log('navigate');
  }
}
