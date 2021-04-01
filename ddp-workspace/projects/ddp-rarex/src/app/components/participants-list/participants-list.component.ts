import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, mergeMap, take, tap } from 'rxjs/operators';

import {
  ActivityInstance,
  ActivityServiceAgent,
  AnnouncementMessage,
  AnnouncementsServiceAgent,
  ConfigurationService,
  GovernedParticipantsServiceAgent,
  Participant,
  SessionMementoService,
  UserActivityServiceAgent,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { RoutePaths } from '../../router-resources';
import { CurrentActivityService } from '../../services/current-activity.service';
import { GovernedUserService } from '../../services/governed-user.service';

interface GovernedParticipant extends Participant {
  activities: ActivityInstance[];
}

@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit {
  loading = false;
  messages: AnnouncementMessage[] = [];
  participants: GovernedParticipant[] = [];

  constructor(
    private router: Router,
    private announcementsService: AnnouncementsServiceAgent,
    private governedParticipantsService: GovernedParticipantsServiceAgent,
    private sessionService: SessionMementoService,
    private userActivityService: UserActivityServiceAgent,
    private workflowService: WorkflowServiceAgent,
    private activityService: ActivityServiceAgent,
    private governedUserService: GovernedUserService,
    private currentActivityService: CurrentActivityService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.clearParticipant();
    this.loadData();
  }

  onStartActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setCurrentActivity(activity);
    this.setParticipant(participantGuid);
    this.redirectToSurvey();
  }

  onContinueActivity(
    participantGuid: string,
    activity: ActivityInstance,
  ): void {
    this.setCurrentActivity(activity);
    this.setParticipant(participantGuid);
    this.redirectToSurvey();
  }

  onEditActivity(participantGuid: string, activity: ActivityInstance): void {
    this.activityService
      .createInstance(this.config.studyGuid, activity.activityCode)
      .pipe(take(1))
      .subscribe(activity => {
        this.setCurrentActivity(activity as ActivityInstance);
        this.setParticipant(participantGuid);
        this.redirectToSurvey();
      });
  }

  onViewActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setCurrentActivity(activity, true);
    this.setParticipant(participantGuid);
    this.redirectToSurvey();
  }

  onAddParticipantClick(): void {
    this.governedParticipantsService
      .addParticipant(this.config.studyGuid)
      .pipe(
        take(1),
        tap(participant => this.sessionService.setParticipant(participant)),
        mergeMap(() => this.workflowService.fromParticipantList()),
      )
      .subscribe(response => {
        this.setCurrentActivity({
          instanceGuid: response.instanceGuid,
        } as ActivityInstance);
        this.redirectToSurvey();
      });
  }

  private redirectToSurvey(): void {
    this.router.navigateByUrl(RoutePaths.Survey);
  }

  private setCurrentActivity(
    activity: ActivityInstance,
    isReadonly = false,
  ): void {
    this.currentActivityService.activity$.next({
      instance: activity,
      isReadonly,
    });
  }

  private setParticipant(participantGuid: string) {
    this.sessionService.setParticipant(participantGuid);
  }

  private clearParticipant(): void {
    this.sessionService.setParticipant(null);
  }

  private loadData(): void {
    this.loading = true;

    this.governedUserService.isGoverned$
      .pipe(
        filter(isGoverned => isGoverned !== null),
        take(1),
        mergeMap(() => this.loadMessages()),
        tap(messages => {
          this.messages = messages;
        }),
        mergeMap(() => this.loadParticipants()),
        map(participants =>
          participants.map(participant =>
            this.loadParticipantActivity(participant.userGuid).pipe(
              map<ActivityInstance[], GovernedParticipant>(activities => ({
                ...participant,
                activities,
              })),
            ),
          ),
        ),
        mergeMap(participantsActivities$ => forkJoin(participantsActivities$)),
      )
      .subscribe({
        next: participants => {
          console.log('Next called');

          this.participants = participants;
        },
        complete: () => {
          console.log('Complete called');

          this.clearParticipant();

          this.loading = false;
        },
      });
  }

  private loadMessages(): Observable<AnnouncementMessage[]> {
    return this.announcementsService
      .getMessages(this.config.studyGuid)
      .pipe(take(1));
  }

  private loadParticipants(): Observable<Participant[]> {
    return this.governedParticipantsService
      .getGovernedStudyParticipants(this.config.studyGuid)
      .pipe(take(1));
  }

  private loadParticipantActivity(
    participantGuid: string,
  ): Observable<ActivityInstance[]> {
    return new Observable(observer => {
      this.sessionService.setParticipant(participantGuid);

      this.userActivityService
        .getActivities(of(this.config.studyGuid))
        .pipe(take(1))
        .subscribe(activities => {
          observer.next(activities);
          observer.complete();
        });
    });
  }
}
