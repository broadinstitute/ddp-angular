import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

import { ActivityCode } from '../../constants/activity-code';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent {
  @Input() isUIDisabled = false;
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();
  @Output() viewActivity = new EventEmitter<ActivityInstance>();
  @Output() updateActivity = new EventEmitter<ActivityInstance>();

  dataSource: ActivityInstance[] = [];
  displayedColumns = ['name', 'summary', 'status', 'actions'];
  icons = {
    [ActivityStatusCodes.CREATED]: 'error',
    [ActivityStatusCodes.IN_PROGRESS]: 'pending',
    [ActivityStatusCodes.COMPLETE]: 'task_alt',
  };
  ActivityStatusCodes = ActivityStatusCodes;

  @Input() set activities(activities: ActivityInstance[]) {
    this.dataSource = activities.map(activity => {
      if (this.hasPreviousInstance(activity) && activity.statusCode === ActivityStatusCodes.CREATED) {
        activity.statusCode = ActivityStatusCodes.IN_PROGRESS;
      }

      return activity;
    });
  }

  onStartActivity(activity: ActivityInstance): void {
    this.startActivity.emit(activity);
  }

  onContinueActivity(activity: ActivityInstance): void {
    this.continueActivity.emit(activity);
  }

  onViewActivity(activity: ActivityInstance): void {
    this.viewActivity.emit(activity);
  }

  onUpdateActivity(activity: ActivityInstance): void {
    this.updateActivity.emit(activity);
  }

  isConsent({ activityCode }: ActivityInstance): boolean {
    return activityCode === ActivityCode.Consent;
  }

  hasPreviousInstance({ previousInstanceGuid }: ActivityInstance): boolean {
    return !!previousInstanceGuid;
  }
}
