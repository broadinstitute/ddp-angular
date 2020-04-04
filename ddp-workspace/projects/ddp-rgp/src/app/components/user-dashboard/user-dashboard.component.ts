import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementsServiceAgent } from 'ddp-sdk';
import { ToolkitConfigurationService, DashboardComponent } from 'toolkit';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent extends DashboardComponent {
  constructor(
    router: Router,
    announcements: AnnouncementsServiceAgent,
    @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
    super(router, announcements, toolkitConfiguration);
  }
}
