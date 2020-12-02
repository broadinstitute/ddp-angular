import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance } from 'ddp-sdk';

import { ActivityCodes } from '../../sdk/constants/activityCodes'
import {
  COMPLETE,
  CREATED,
  IN_PROGRESS,
} from '../workflow-progress/workflow-progress';

@Component({
  selector: 'atcp-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent {
  @Input() activities: ActivityInstance[];
  @Input() displayedColumns = [
    'activityName',
    'activitySummary',
    'createdAt',
    'questionCount',
    'actions',
  ];
  @Input() opaque: boolean = false;
  @Output() startActivity = new EventEmitter<string>();
  @Output() continueActivity = new EventEmitter<string>();
  @Output() viewActivity = new EventEmitter<string>();
  @Output() editActivity = new EventEmitter<ActivityInstance>();

  statusCodes = { COMPLETE, CREATED, IN_PROGRESS };
  activityCodes = ActivityCodes;

  constructor() {}

  get currentActivity(): ActivityInstance | null {
    const inProgressActivity = this.activities.find(
      activity => activity.statusCode === this.statusCodes.IN_PROGRESS
    );

    if (inProgressActivity) return inProgressActivity;

    const createdActivity = this.activities.find(
      activity => activity.statusCode === this.statusCodes.CREATED
    );

    if (createdActivity) return createdActivity;

    return null;
  }

  showQuestionCount(activity: ActivityInstance): boolean {
    return activity.statusCode === IN_PROGRESS;
  }

  isRowDisabled(activity: ActivityInstance): boolean {
    return activity.statusCode === this.statusCodes.CREATED && activity !== this.currentActivity;
  }
}
