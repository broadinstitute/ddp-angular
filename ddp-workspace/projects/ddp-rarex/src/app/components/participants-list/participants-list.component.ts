import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  UserManagementServiceAgent,
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
  private expandedMap: Record<string, boolean> = {};

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private announcementsService: AnnouncementsServiceAgent,
    private governedParticipantsService: GovernedParticipantsServiceAgent,
    private sessionService: SessionMementoService,
    private userActivityService: UserActivityServiceAgent,
    private workflowService: WorkflowServiceAgent,
    private activityService: ActivityServiceAgent,
    private userManagementService: UserManagementServiceAgent,
    private governedUserService: GovernedUserService,
    private currentActivityService: CurrentActivityService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.clearParticipant();
    this.loadData();
  }

  getParticipantName({ userProfile }: GovernedParticipant): string {
    const { firstName, lastName } = userProfile;

    if (!firstName && !lastName) {
      return this.translateService.instant('ParticipantsList.NewParticipant');
    }

    return `${firstName} ${lastName}`;
  }

  isParticipantContentExpanded({ userGuid }: GovernedParticipant): boolean {
    return !!this.expandedMap[userGuid];
  }

  onExpandClick({ userGuid }: GovernedParticipant): void {
    this.expandedMap[userGuid] = !this.expandedMap[userGuid];
  }

  onDeleteClick({ userGuid }: GovernedParticipant): void {
    this.loading = true;

    this.deleteParticipant(userGuid)
      .pipe(
        tap(
          () =>
            (this.participants = this.participants.filter(
              participant => participant.userGuid !== userGuid,
            )),
        ),
      )
      .subscribe(() => {
        this.loading = false;
      });
  }

  onStartActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity);
    this.redirectToSurvey();
  }

  onContinueActivity(
    participantGuid: string,
    activity: ActivityInstance,
  ): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity);
    this.redirectToSurvey();
  }

  onEditActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);

    this.activityService
      .createInstance(this.config.studyGuid, activity.activityCode)
      .pipe(take(1))
      .subscribe(activity => {
        this.setCurrentActivity(activity as ActivityInstance);
        this.redirectToSurvey();
      });
  }

  onViewActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity, true);
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
        mergeMap(participants => {
          const accidentallyCreatedParticipant = participants.find(
            participant => !participant.activities.length,
          );

          if (!accidentallyCreatedParticipant) {
            return of(participants);
          }

          return this.deleteParticipant(
            accidentallyCreatedParticipant.userGuid,
          ).pipe(
            map(() =>
              participants.filter(
                participant =>
                  participant.userGuid !==
                  accidentallyCreatedParticipant.userGuid,
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: participants => {
          this.participants = participants;
        },
        complete: () => {
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

  private deleteParticipant(participantGuid: string): Observable<void> {
    return this.userManagementService.deleteUser(participantGuid).pipe(take(1));
  }
}
