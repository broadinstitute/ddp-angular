import { Component, Inject } from '@angular/core';
import { DashboardRedesignedComponent, HeaderConfigurationService, ToolkitConfigurationService } from 'toolkit';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends DashboardRedesignedComponent {
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
}
