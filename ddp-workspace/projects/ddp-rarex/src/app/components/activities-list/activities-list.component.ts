import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

import { ActivityCodes } from '../../constants/activity-codes';

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
    ActivityCodes.GeneralInformation,
    ActivityCodes.HealthAndDevelopment,
    ActivityCodes.QualityOfLife,
    ActivityCodes.ParentalQualityOfLife,
  ];
  private consentActivities = [
    ActivityCodes.SelfConsent,
    ActivityCodes.ConsentAssent,
    ActivityCodes.ParentalConsent,
  ];

  shouldShowQuestionCount(activity: ActivityInstance): boolean {
    const questionCount = activity.numQuestions;
    const answeredQuestionCount = activity.numQuestionsAnswered;

    if (this.isConsentOrAssent(activity)) {
      return false;
    }

    return questionCount !== answeredQuestionCount;
  }

  canCopyActivity(activity: ActivityInstance): boolean {
    return this.allowedToEditActivities.includes(
      activity.activityCode as ActivityCodes,
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

  private isConsentOrAssent(activity: ActivityInstance): boolean {
    return this.consentActivities.includes(
      activity.activityCode as ActivityCodes,
    );
  }
}
