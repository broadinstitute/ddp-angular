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
  UserProfileServiceAgent,
} from 'ddp-sdk';

interface Participant {
  firstName: string;
  lastName: string;
  guid: string;
  activities: ActivityInstance[];
  isOperator: boolean;
}

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss'],
})
export class ParticipantsListComponent implements OnInit {
  isAddParticipantBtnDisabled = false;
  isAddMyselfBtnDisabled = false;
  loading = false;
  messages: AnnouncementMessage[] = [];
  participants: Participant[] = [];
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
    private userProfileService: UserProfileServiceAgent,
    private userManagementService: UserManagementServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
    private governedParticipantsService: GovernedParticipantsServiceAgent,
  ) {}

  ngOnInit(): void {
    this.clearParticipant();
    this.loadData();
  }

  getParticipantName({ firstName, lastName }: Participant): string {
    if (!firstName && !lastName) {
      return this.translateService.instant('ParticipantsList.NewParticipant');
    }

    return `${firstName} ${lastName}`;
  }

  isParticipantContentExpanded({ guid }: Participant): boolean {
    return !!this.expandedMap[guid];
  }

  onExpandClick({ guid }: Participant): void {
    this.expandedMap[guid] = !this.expandedMap[guid];
  }

  onDeleteClick({ guid }: Participant): void {
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
        mergeMap(() => this.deleteParticipant(guid)),
        tap(() => {
          this.participants = this.participants.filter(participant => participant.guid !== guid);
        }),
        catchError(() => {
          this.errorMessage = this.translateService.instant('ParticipantsList.DeleteError');

          return of(null);
        }),
      )
      .subscribe(() => {
        this.loading = false;
        this.expandedMap[guid] = null;

        if (this.participants.length === 1) {
          const [{ guid: leftUserGuid }] = this.participants;

          this.expandedMap[leftUserGuid] = true;
        }
      });
  }

  onStartActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity);
    this.redirectToSurvey(activity.instanceGuid);
  }

  onContinueActivity(participantGuid: string, activity: ActivityInstance): void {
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity);
    this.redirectToSurvey(activity.instanceGuid);
  }

  onEditActivity(participantGuid: string, activityToEdit: ActivityInstance): void {
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
        tap(participantGuid => this.sessionService.setParticipant(participantGuid)),
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

  onAddMyselfClick(): void {
    this.isAddMyselfBtnDisabled = true;

    this.sessionService.setParticipant(null);

    this.workflowService
      .fromParticipantList()
      .pipe(filter(res => !!res))
      .subscribe({
        next: res => {
          this.isAddMyselfBtnDisabled = false;

          if (res.instanceGuid) {
            this.setCurrentActivity({
              instanceGuid: res.instanceGuid,
            } as ActivityInstance);
            this.redirectToSurvey(res.instanceGuid);
          }
        },
        error: () => {
          this.isAddMyselfBtnDisabled = false;
        },
      });
  }

  private redirectToSurvey(id: string): void {
    this.router.navigate([Route.Activity, id]);
  }

  private setCurrentActivity(activity: ActivityInstance, isReadonly = false): void {
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
            this.loadParticipantActivity(participant.guid).pipe(
              map<ActivityInstance[], Participant>(activities => ({
                ...participant,
                activities,
              })),
            ),
          ),
        ),
        mergeMap(participantsActivities$ => forkJoin(participantsActivities$)),
        /**
         * Delete participant without any activities
         */
        mergeMap(participants => {
          const accidentallyCreatedParticipant = participants.find(participant => !participant.activities.length);

          if (!accidentallyCreatedParticipant || accidentallyCreatedParticipant.isOperator) {
            return of(participants);
          }

          return this.deleteParticipant(accidentallyCreatedParticipant.guid).pipe(
            map(() => participants.filter(participant => participant.guid !== accidentallyCreatedParticipant.guid)),
          );
        }),
        /**
         * Hide operator if they haven't enrolled themselves yet
         */
        map(participants => {
          /**
           * Operator is always first in the list, see line `this.loadParticipants` method
           */
          const [operator, ...rest] = participants;

          if (!operator.activities.length) {
            return rest;
          }

          return participants;
        }),
      )
      .subscribe({
        next: participants => {
          this.participants = participants;

          if (this.participants.length === 1) {
            const [{ guid }] = this.participants;

            this.expandedMap[guid] = true;
          }
        },
        complete: () => {
          this.clearParticipant();

          this.loading = false;
        },
      });
  }

  private loadMessages(): Observable<AnnouncementMessage[]> {
    return this.announcementsService.getMessages(this.config.studyGuid).pipe(take(1));
  }

  private loadOperator(): Observable<Participant> {
    return this.userProfileService.profile.pipe(
      filter(profile => !!profile),
      map(({ profile }) => ({
        firstName: profile.firstName,
        lastName: profile.lastName,
        activities: [],
        guid: this.sessionService.session.userGuid,
        isOperator: true,
      })),
    );
  }

  private loadParticipants(): Observable<Participant[]> {
    const operator$ = this.loadOperator();
    const governedParticipants$ = this.governedParticipantsService
      .getGovernedStudyParticipants(this.config.studyGuid)
      .pipe(take(1));

    return forkJoin({
      operator: operator$,
      governedParticipants: governedParticipants$,
    }).pipe(
      map(({ operator, governedParticipants }) => {
        const participants: Participant[] = governedParticipants.map(p => ({
          firstName: p.userProfile.firstName,
          lastName: p.userProfile.lastName,
          activities: [],
          guid: p.userGuid,
          isOperator: false,
        }));

        return [operator, ...participants];
      }),
    );
  }

  private loadParticipantActivity(participantGuid: string): Observable<ActivityInstance[]> {
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
