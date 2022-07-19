import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DashboardRedesignedComponent, HeaderConfigurationService, ToolkitConfigurationService } from 'toolkit';
import { ActivityCode } from '../../types';
import {
  AnnouncementsServiceAgent,
  GovernedParticipantsServiceAgent,
  LoggingService,
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends DashboardRedesignedComponent implements OnInit, OnDestroy {
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
    console.log('[IS GOVERNED]', this.governedUserService.isGoverned);
    this.governedUserService.checkIfGoverned().subscribe((data) => {
      console.log('[CHECK IF GOVERNED]', data);
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
