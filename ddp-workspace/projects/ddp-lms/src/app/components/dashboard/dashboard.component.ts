import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, iif, map, Observable, of } from 'rxjs';
import { DashboardRedesignedComponent, HeaderConfigurationService, ToolkitConfigurationService } from 'toolkit';
import { ActivityCode } from '../../types';
import {
  ActivityInstance,
  AnnouncementsServiceAgent,
  GovernedParticipantsServiceAgent,
  LoggingService,
  Participant,
  ParticipantsSearchServiceAgent,
  SessionMementoService,
  UserActivityServiceAgent,
  UserInvitationServiceAgent,
  UserManagementServiceAgent,
  UserProfileServiceAgent,
  WorkflowServiceAgent,
} from 'ddp-sdk';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { GovernedUserService } from '../../services/governed-user.service';
import {filter, mergeMap, take} from 'rxjs/operators';

interface GovernedParticipant extends Participant {
  activities: ActivityInstance[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends DashboardRedesignedComponent implements OnInit, OnDestroy {
  private participants: any;

  constructor(
    protected headerConfig: HeaderConfigurationService,
    protected session: SessionMementoService,
    protected router: Router,
    protected _announcements: AnnouncementsServiceAgent,
    protected userInvitation: UserInvitationServiceAgent,
    _participantsSearch: ParticipantsSearchServiceAgent,
    protected governedParticipantsAgent: GovernedParticipantsServiceAgent,
    protected userActivityServiceAgent: UserActivityServiceAgent,
    protected userProfileService: UserProfileServiceAgent,
    protected translate: TranslateService,
    protected workflowService: WorkflowServiceAgent,
    protected userManagementService: UserManagementServiceAgent,
    protected logger: LoggingService,
    public dialog: MatDialog,
    private governedUserService: GovernedUserService,
    @Inject('toolkit.toolkitConfig') public toolkitConfig: ToolkitConfigurationService
  ) {
    super(
      headerConfig,
      session,
      router,
      _announcements,
      userInvitation,
      _participantsSearch,
      governedParticipantsAgent,
      userActivityServiceAgent,
      userProfileService,
      translate,
      workflowService,
      userManagementService,
      logger,
      dialog,
      toolkitConfig
    );
  }

  get isParent(): Observable<boolean> {
    return this.userActivities$.pipe(
      map((activities) => activities.some(({ activityCode }) => activityCode === ActivityCode.Consent))
    );
  }

  get isChild(): Observable<boolean> {
    return this.userActivities$.pipe(
      map((activities) =>
        activities.some(
          ({ activityCode }) =>
            activityCode === ActivityCode.ConsentAssent || activityCode === ActivityCode.ParentalConsent
        )
      )
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadData();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  private loadData(): void {
    this.loadParticipants().subscribe(participants => {
      this.participants = participants;
      console.log(participants);
    });
   // this.governedUserService.isGoverned$
   //    .pipe(
   //      take(1),
   //      mergeMap(() => this.loadParticipants()),
   //      mergeMap((isGoverned) =>
   //        iif(() => isGoverned.length > 0, of(false), this.governedParticipantsAgent.addParticipant(this.studyGuid))
   //      ),
   //      map((participants) =>
   //        participants.map((participant) =>
   //          this.loadParticipantActivity(participant.userGuid).pipe(
   //            map<ActivityInstance[], GovernedParticipant>((activities) => ({
   //              ...participant,
   //              activities,
   //            }))
   //          )
   //        )
   //      ),
   //      mergeMap((participantsActivities$) => forkJoin(participantsActivities$)),
   //      mergeMap((participants) => {
   //        const accidentallyCreatedParticipant = participants.find((participant) => !participant.activities.length);
   //
   //        if (!accidentallyCreatedParticipant) {
   //          return of(participants);
   //        }
   //
   //        return this.deleteParticipant(accidentallyCreatedParticipant.userGuid).pipe(
   //          map(() =>
   //            participants.filter((participant) => participant.userGuid !== accidentallyCreatedParticipant.userGuid)
   //          )
   //        );
   //      })
   //    )
   //    .subscribe({
   //      next: (participants) => {
   //        this.participants = participants;
   //      },
   //      complete: () => {
   //        this.clearParticipant();
   //      },
   //    });
  }

  private deleteParticipant(participantGuid: string): Observable<void> {
    return this.userManagementService.deleteUser(participantGuid).pipe(take(1));
  }

  private loadParticipantActivity(participantGuid: string): Observable<ActivityInstance[]> {
    return new Observable((observer) => {
      this.session.setParticipant(participantGuid);

      this.userActivityServiceAgent
        .getActivities(of(this.toolkitConfig.studyGuid))
        .pipe(take(1))
        .subscribe((activities) => {
          observer.next(activities);
          observer.complete();
        });
    });
  }

  private loadParticipants(): Observable<Participant[]> {
    return this.governedParticipantsAgent.getGovernedStudyParticipants(this.toolkitConfig.studyGuid).pipe(take(1));
  }

  private clearParticipant(): void {
    this.session.setParticipant(null);
  }
}
