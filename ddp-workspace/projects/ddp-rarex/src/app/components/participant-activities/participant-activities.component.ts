import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance } from 'ddp-sdk';

import { ActivityCodes } from '../../constants/activity-codes';
import { ActivityStatusCodes } from '../../constants/activity-status-codes';

@Component({
  selector: 'app-participant-activities',
  templateUrl: './participant-activities.component.html',
  styleUrls: ['./participant-activities.component.scss'],
})
export class ParticipantActivitiesComponent {
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

  shouldShowQuestionCount(activity: ActivityInstance): boolean {
    const questionCount = activity.numQuestions;
    const answeredQuestionCount = activity.numQuestionsAnswered;

    if (this.isConsentOrAssent(activity)) {
      return false;
    }

    return questionCount !== answeredQuestionCount;
  }

  canCopyActivity(activity: ActivityInstance): boolean {
    return !this.isConsentOrAssent(activity);
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
    const activityCode = activity.activityCode;

    return (
      activityCode === ActivityCodes.CONSENT ||
      activityCode === ActivityCodes.CONSENT_ASSENT
    );
  }
}
