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

import { CREATED, IN_PROGRESS } from '../workflow-progress/workflow-progress';
import * as RouterResources from '../../router-resources';

enum ParticipantActions {
  Start = 'Start',
  Continue = 'Continue',
  ViewProfile = 'ViewProfile',
}

interface Participant {
  guid: string;
  profile: UserProfile;
  activities: ActivityInstance[];
}

interface EnrollmentStatus {
  activityCode: string;
  statusCode: string;
}

interface ParticipantListEntry {
  guid: string;
  name: string | null;
  enrollmentStatus: EnrollmentStatus | null;
  action: ParticipantActions;
  isPlaceholder?: boolean;
}

@Component({
  selector: 'atcp-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'enrollmentStatus', 'action'];
  dataSource: ParticipantListEntry[] = [];
  isLoaded = false;

  constructor(
    private readonly router: Router,
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
        tap(response => this.session.setParticipant(response.body.ddpUserGuid)),
        switchMap(() => this.workflowAgent.fromParticipantList())
      )
      .subscribe(() => {
        this.router.navigateByUrl(RouterResources.Dashboard);
      });
  }

  onActionButtonClick(
    action: ParticipantActions,
    participantGuid: string
  ): void {
    if (action === ParticipantActions.Start) {
      this.session.setParticipant(participantGuid);
      this.workflowAgent
        .fromParticipantList()
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl(RouterResources.Dashboard);
        });
    }

    if (action === ParticipantActions.Continue) {
      this.session.setParticipant(participantGuid);
      this.router.navigateByUrl(RouterResources.Dashboard);
    }
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
          this.dataSource = participants.map(participant =>
            this.convertParticipant(participant)
          );
        },
        complete: () => {
          this.session.setParticipant(null);

          if (!this.dataSource.length) {
            this.dataSource = [
              {
                guid: null,
                name: null,
                action: null,
                enrollmentStatus: null,
                isPlaceholder: true,
              },
            ];
          }

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

  private convertParticipant(participant: Participant): ParticipantListEntry {
    const name = this.getParticipantName(participant.profile);
    const enrollmentStatus = this.getParticipantEnrollmentStatus(participant);
    const action = this.getParticipantAction(enrollmentStatus);

    return { guid: participant.guid, name, enrollmentStatus, action };
  }

  private getParticipantName(participantProfile: UserProfile): string | null {
    const { firstName, lastName } = participantProfile;

    if (!firstName || !lastName) {
      return null;
    }

    return `${firstName} ${lastName}`;
  }

  private getParticipantEnrollmentStatus(
    participant: Participant
  ): EnrollmentStatus | null {
    const { activities } = participant;

    if (!activities.length) {
      return null;
    }

    const inProgressActivity = activities.find(
      activity => activity.statusCode === IN_PROGRESS
    );

    if (inProgressActivity) {
      return {
        activityCode: inProgressActivity.activityCode,
        statusCode: IN_PROGRESS,
      };
    }

    const createdActivity = activities.find(
      activity => activity.statusCode === CREATED
    );

    if (createdActivity) {
      return {
        activityCode: createdActivity.activityCode,
        statusCode: CREATED,
      };
    }

    const lastActivity = activities[activities.length - 1];

    return {
      activityCode: lastActivity.activityCode,
      statusCode: lastActivity.statusCode,
    };
  }

  private getParticipantAction(
    enrollmentStatus: EnrollmentStatus | null
  ): ParticipantActions {
    if (enrollmentStatus === null) {
      return ParticipantActions.Start;
    }

    if (
      enrollmentStatus.statusCode === IN_PROGRESS ||
      enrollmentStatus.statusCode === CREATED
    ) {
      return ParticipantActions.Continue;
    }

    return ParticipantActions.ViewProfile;
  }
}
