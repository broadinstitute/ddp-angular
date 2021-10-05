import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';
import { ActivityCode } from '../../constants/activity-code';


@Component({
  selector: 'app-activities-list',
  templateUrl: './activities-list.component.html',
  styleUrls: ['./activities-list.component.scss'],
})
export class ActivitiesListComponent {
  @Input() activities: ActivityInstance[];
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();
  @Output() editActivity = new EventEmitter<ActivityInstance>();
  @Output() viewActivity = new EventEmitter<ActivityInstance>();
  displayedColumns = [
    'activityName',
    'activitySummary',
    'activityCreatedAt',
    'activityStatus',
    'activityActions',
  ];
  ActivityStatusCodes = ActivityStatusCodes;
  private allowedToEditActivities = [
    // ActivityCode.GeneralInformation,
    // ActivityCode.HealthAndDevelopment,
    // ActivityCode.QualityOfLife,
    // ActivityCode.ChildQualityOfLife,
    // ActivityCode.PatientQualityOfLife,
    // ActivityCode.DataSharing,
  ];
  private consentActivities = [
    // ActivityCode.SelfConsent,
    // ActivityCode.ConsentAssent,
    // ActivityCode.ParentalConsent,
    // ActivityCode.LarConsent,
    // ActivityCode.LarConsentAssent,
  ];

  canCopyActivity(activity: ActivityInstance): boolean {
    return this.allowedToEditActivities.includes(
      activity.activityCode as ActivityCode,
    );
  }

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
}
