import { Router } from '@angular/router';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { Route } from '../../../constants/route';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { ActivityCode } from '../../../constants/activity-code';
import {COMPLETE, IN_PROGRESS} from '../../../../../../ddp-atcp/src/app/components/workflow-progress/workflow-progress';

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
  isEnrollBtnDisabled = false;
  isOperatorEnrolled = false;
  loading = false;
  messages: AnnouncementMessage[] = [];
  participants: Participant[] = [];
  private expandedMap: Record<string, boolean> = {};
  errorMessage: string | null = null;
  isPageBusy = false;
  @Input() allowParticipantRemoval = false;

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

  getParticipantName({ firstName, lastName, isOperator }: Participant): string {
    if (!firstName && !lastName) {
      return this.translateService.instant(isOperator ? 'ParticipantsList.MySelf' : 'ParticipantsList.NewParticipant');
    }

    return `${firstName} ${lastName}`;
  }

    getParticipantStatus({ activities }: Participant): string {
        return activities.filter(act => act.statusCode !== COMPLETE).length > 0 ? IN_PROGRESS : COMPLETE;
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
    this.isPageBusy = true;
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activityToEdit, false);
    this.redirectToSurvey(activityToEdit.instanceGuid);
    this.isPageBusy = false;
  }

  onViewActivity(participantGuid: string, activity: ActivityInstance): void {
    this.isPageBusy = true;
    this.setParticipant(participantGuid);
    this.setCurrentActivity(activity, true);
    this.redirectToSurvey(activity.instanceGuid);
    this.isPageBusy = false;
  }

  onAddParticipantClick(): void {
    this.isEnrollBtnDisabled = true;
    let userGuid;

    this.governedParticipantsService
      .addParticipant(this.config.studyGuid)
      .pipe(
        take(1),
        tap(participantGuid => userGuid = participantGuid),
        tap(participantGuid => this.sessionService.setParticipant(participantGuid)),
        mergeMap(() => this.workflowService.fromParticipantList([401, 404, 500])),
        catchError(() => {
          if (userGuid) {
            this.deleteParticipant(userGuid).subscribe(() => this.isEnrollBtnDisabled = false);
          } else {
            this.isEnrollBtnDisabled = false;
          }

          return EMPTY;
        })
      )
      .subscribe(response => {
        this.isEnrollBtnDisabled = false;
        this.setCurrentActivity({ instanceGuid: response.instanceGuid } as ActivityInstance);
        this.redirectToSurvey(response.instanceGuid);
      });
  }

  onAddDependentClick(): void {
    this.isEnrollBtnDisabled = true;

    this.governedParticipantsService
      .addParticipant(this.config.studyGuid)
      .pipe(
        take(1),
        tap(participantGuid => this.sessionService.setParticipant(participantGuid))
      )
      .subscribe({
        next: participantGuid => {
          this.activityService
            .createInstance(this.config.studyGuid, 'ADD_PARTICIPANT_DEPENDENT', null, { throwError: true })
            .pipe(
              take(1),
              catchError(() => {
                this.deleteParticipant(participantGuid).subscribe(() => this.isEnrollBtnDisabled = false);
                return EMPTY;
              })
            )
            .subscribe(activity => {
              this.isEnrollBtnDisabled = false;
              this.setCurrentActivity(activity as ActivityInstance);
              this.redirectToSurvey(activity.instanceGuid);
            });
        },
        error: () => {
          this.isEnrollBtnDisabled = false;
        },
      });
  }

  onAddMyselfClick(): void {
    this.isEnrollBtnDisabled = true;

    this.sessionService.setParticipant(null);

    this.workflowService
      .fromParticipantList()
      .pipe(filter(res => !!res))
      .subscribe({
        next: res => {
          this.isEnrollBtnDisabled = false;

          if (res.instanceGuid) {
            this.setCurrentActivity({
              instanceGuid: res.instanceGuid,
            } as ActivityInstance);
            this.redirectToSurvey(res.instanceGuid);
          }
        },
        error: () => {
          this.isEnrollBtnDisabled = false;
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
         * Delete participant with only "Add Participant" activity
         */
        mergeMap(participants => {
          const accidentallyCreatedParticipant = participants.find(
            participant => !participant.isOperator && this.hasOnlyAddParticipantActivity(participant.activities),
          );

          if (!accidentallyCreatedParticipant) {
            return of(participants);
          }

          return this.deleteParticipant(accidentallyCreatedParticipant.guid).pipe(
            /**
             * Filter out deleted participant
             */
            map(() => participants
                .filter(participant => participant.guid !== accidentallyCreatedParticipant.guid)
            ),
          );
        }),
        /**
         * Remove "Add Participant" activity from view & hide operator if they haven't enrolled themselves yet
         */
        // eslint-disable-next-line arrow-body-style
        map(participants => {
          return participants.reduce<Participant[]>((acc, participant) => {
            if (participant.isOperator) {
              if (participant.activities.length > 1) {
                this.isOperatorEnrolled = true;

                acc.push({
                  ...participant,
                  activities: this.filterOutAddParticipant(participant.activities),
                });
              }
            } else {
              acc.push({
                ...participant,
                activities: this.filterOutAddParticipant(participant.activities),
              });
            }

            return acc;
          }, []);
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

  private hasOnlyAddParticipantActivity(activities: ActivityInstance[]): boolean {
    return (
      activities.length === 1 &&
      [
        ActivityCode.AddParticipantSelf,
        ActivityCode.AddParticipantParental,
        ActivityCode.AddParticipantDependent,
      ].includes(activities[0].activityCode as ActivityCode)
    );
  }

  private filterOutAddParticipant(activities: ActivityInstance[]): ActivityInstance[] {
    return activities.filter(
      activity =>
        ![
          ActivityCode.AddParticipantSelf,
          ActivityCode.AddParticipantParental,
          ActivityCode.AddParticipantDependent,
        ].includes(activity.activityCode as ActivityCode),
    );
  }
}
