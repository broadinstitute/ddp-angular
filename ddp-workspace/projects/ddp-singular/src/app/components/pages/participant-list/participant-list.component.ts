import { Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { Route } from '../../../constants/route';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, OnInit } from '@angular/core';
import { catchError, filter, map, mergeMap, take, tap } from 'rxjs/operators';
import { CurrentActivityService } from '../../../services/current-activity.service';
import { ParticipantDeletionDialogComponent } from '../../participant-deletion-dialog/participant-deletion-dialog.component';
import {
  Participant,
  ActivityInstance,
  AnnouncementMessage,
  ActivityServiceAgent,
  ConfigurationService,
  WorkflowServiceAgent,
  SessionMementoService,
  UserActivityServiceAgent,
  AnnouncementsServiceAgent,
  UserManagementServiceAgent,
  GovernedParticipantsServiceAgent,
} from 'ddp-sdk';


interface GovernedParticipant extends Participant {
  activities: ActivityInstance[];
}

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit {
  isAddParticipantBtnDisabled = false;
  loading = false;
  messages: AnnouncementMessage[] = [];
  participants: GovernedParticipant[] = [];
  private expandedMap: Record<string, boolean> = {};
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private sessionService: SessionMementoService,
    private workflowService: WorkflowServiceAgent,
    private activityService: ActivityServiceAgent,
    private userActivityService: UserActivityServiceAgent,
    private currentActivityService: CurrentActivityService,
    private announcementsService: AnnouncementsServiceAgent,
    private userManagementService: UserManagementServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
    private governedParticipantsService: GovernedParticipantsServiceAgent,
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
    const dialogRef = this.dialog.open(ParticipantDeletionDialogComponent, {
      maxWidth: '640px',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((shallDelete: boolean) => shallDelete),
        tap(() => {
          this.loading = true;
          this.errorMessage = null;
        }),
        mergeMap(() => this.deleteParticipant(userGuid)),
        tap(() => {
          this.participants = this.participants.filter(
            participant => participant.userGuid !== userGuid,
          );
        }),
        catchError(() => {
          this.errorMessage = this.translateService.instant(
            'ParticipantsList.DeleteError',
          );

          return of(null);
        }),
      )
      .subscribe(() => {
        this.loading = false;
        this.expandedMap[userGuid] = null;

        if (this.participants.length === 1) {
          const [{ userGuid: leftUserGuid }] = this.participants;

          this.expandedMap[leftUserGuid] = true;
        }
      });
  }

  onStartActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity);
    this.redirectToSurvey(activity.instanceGuid);
  }

  onContinueActivity(
    participantGuid: string,
    activity: ActivityInstance,
  ): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity);
    this.redirectToSurvey(activity.instanceGuid);
  }

  onEditActivity(
    participantGuid: string,
    activityToEdit: ActivityInstance,
  ): void {
    this.setParticipant(participantGuid);

    this.activityService
      .createInstance(this.config.studyGuid, activityToEdit.activityCode)
      .pipe(take(1))
      .subscribe(activity => {
        this.setCurrentActivity(activity as ActivityInstance);
        this.redirectToSurvey(activity.instanceGuid);
      });
  }

  onViewActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity, true);
    this.redirectToSurvey(activity.instanceGuid);
  }

  onAddParticipantClick(): void {
    this.isAddParticipantBtnDisabled = true;

    this.governedParticipantsService
      .addParticipant(this.config.studyGuid)
      .pipe(
        take(1),
        tap(participant => this.sessionService.setParticipant(participant)),
        mergeMap(() => this.workflowService.fromParticipantList()),
      )
      .subscribe({
        next: response => {
          this.isAddParticipantBtnDisabled = false;

          this.setCurrentActivity({
            instanceGuid: response.instanceGuid,
          } as ActivityInstance);
          this.redirectToSurvey(response.instanceGuid);
        },
        error: () => {
          this.isAddParticipantBtnDisabled = false;
        },
      });
  }

  private redirectToSurvey(id: string): void {
    this.router.navigate([Route.Activity, id]);
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

  private setParticipant(participantGuid: string): void {
    this.sessionService.setParticipant(participantGuid);
  }

  private clearParticipant(): void {
    this.sessionService.setParticipant(null);
  }

  private loadData(): void {
    this.loading = true;

    this.loadMessages()
      .pipe(
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

          if (this.participants.length === 1) {
            const [{ userGuid }] = this.participants;

            this.expandedMap[userGuid] = true;
          }
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
