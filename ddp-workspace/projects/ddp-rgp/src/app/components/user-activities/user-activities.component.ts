import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ActivityInstance } from 'ddp-sdk';

import { ActivityStatusCode } from '../../constants/activity-status-code';
import { Routes } from '../../routes';

enum StatusIcon {
  CREATED = 'info',
  IN_PROGRESS = 'pending',
  COMPLETE = 'check_circle',
}

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent {
  @Input() activities: ActivityInstance[] = [];
  displayedColumns = ['name', 'summary', 'status', 'actions'];
  StatusIcon = StatusIcon;
  ActivityStatusCode = ActivityStatusCode;

  constructor(private router: Router) {}

  redirectToActivity(activity: ActivityInstance): void {
    const path = Routes.ActivityId.replace(':id', activity.instanceGuid);

    this.router.navigateByUrl(path);
  }
}
