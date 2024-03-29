import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';
import { ActivityCode } from '../../constants/activity-code';
import { ActivityIcons } from '../../constants/activity-icons';

@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss'],
})
export class ActivitiesListComponent {
  @Input() activities: ActivityInstance[];
  @Input() disableButtons = false;
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();
  @Output() editActivity = new EventEmitter<ActivityInstance>();
  @Output() viewActivity = new EventEmitter<ActivityInstance>();
  displayedColumns = ['activityName', 'activitySummary', 'activityStatus', 'activityActions'];
  ActivityCode = ActivityCode;
  ActivityStatusCodes = ActivityStatusCodes;

  onStartClick(activity: ActivityInstance): void {
    this.startActivity.emit(activity);
  }

  onContinueClick(activity: ActivityInstance): void {
    this.continueActivity.emit(activity);
  }

  onEditClick(activity: ActivityInstance): void {
    this.editActivity.emit(activity);
  }

  onViewClick(activity: ActivityInstance): void {
    this.viewActivity.emit(activity);
  }

  hasPreviousInstance(activity: ActivityInstance): boolean {
    return !!activity.previousInstanceGuid;
  }

  getStatusIcon(status: ActivityInstance): ActivityIcons {
      return ActivityIcons[this.getActivityStatusCode(status)];
  }

  getActivityStatusCode(activity: ActivityInstance): ActivityStatusCodes {
    if (this.hasPreviousInstance(activity)) {
      if (
        activity.statusCode === ActivityStatusCodes.CREATED ||
        activity.statusCode === ActivityStatusCodes.IN_PROGRESS
      ) {
        return ActivityStatusCodes.IN_PROGRESS;
      }

      return ActivityStatusCodes.COMPLETE;
    }

    return activity.statusCode as ActivityStatusCodes;
  }

  isActivityEditable(activity: ActivityInstance): boolean {
    return activity.statusCode === ActivityStatusCodes.COMPLETE && !activity.readonly;
  }

  isMedicalRecordFileUpload(activity: ActivityInstance): boolean {
    return activity.activityCode === ActivityCode.MedicalRecordFileUpload;
  }
}
