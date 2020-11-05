import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { map, take, switchMap, tap } from 'rxjs/operators';

import {
  SessionMementoService,
  ConfigurationService,
  GovernedParticipantsServiceAgent,
  UserProfile,
  ActivityInstance,
  UserActivityServiceAgent,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { ActivityService } from '../../services/activity.service';
import * as RouterResources from '../../router-resources';

export interface Participant {
  guid: string;
  profile: UserProfile;
  activities: ActivityInstance[];
}

@Component({
  selector: 'atcp-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[] = [];
  isLoaded = false;

  constructor(
    private readonly router: Router,
    private readonly activityService: ActivityService,
    private readonly session: SessionMementoService,
    private readonly governedParticipantsAgent: GovernedParticipantsServiceAgent,
    private readonly userActivityAgent: UserActivityServiceAgent,
    private readonly workflowAgent: WorkflowServiceAgent,
    @Inject('ddp.config') private readonly config: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.session.setParticipant(null);

    this.getParticipants();
  }

  onAddParticipantClick(): void {
    this.governedParticipantsAgent
      .addParticipant(this.config.studyGuid)
      .pipe(
        take(1),
        tap(participantGuid => this.session.setParticipant(participantGuid)),
        switchMap(() => this.workflowAgent.fromParticipantList())
      )
      .subscribe(() => {
        this.activityService.currentActivityInstanceGuid = null;
        this.router.navigateByUrl(RouterResources.Survey);
      });
  }

  private getParticipants(): void {
    this.governedParticipantsAgent
      .getGovernedStudyParticipants(this.config.studyGuid)
      .pipe(
        take(1),
        map((participants): Omit<Participant, 'activities'>[] =>
          participants.map(participant => ({
            guid: participant.userGuid,
            profile: participant.userProfile,
          }))
        ),
        map(participants =>
          participants.map(participant =>
            this.fetchParticipantActivity(participant.guid).pipe(
              map(activities => ({ ...participant, activities }))
            )
          )
        ),
        switchMap(participants$ => forkJoin(participants$))
      )
      .subscribe({
        next: participants => {
          this.participants = participants;
        },
        complete: () => {
          this.session.setParticipant(null);

          this.isLoaded = true;
        },
      });
  }

  private fetchParticipantActivity(
    participantGuid: string
  ): Observable<ActivityInstance[]> {
    return new Observable(observer => {
      this.session.setParticipant(participantGuid);

      this.userActivityAgent
        .getActivities(of(this.config.studyGuid))
        .subscribe(activities => {
          observer.next(activities);
          observer.complete();
        });
    });
  }
}
