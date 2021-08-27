import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

import { ActivityCode } from '../../constants/activity-code';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent {
  @Input() activities: ActivityInstance[];
  @Input() sleepLogUrl: string | null = null;
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();
  @Output() viewActivity = new EventEmitter<ActivityInstance>();

  displayedColumns = ['name', 'summary', 'status', 'actions'];
  ActivityStatusCode = ActivityStatusCodes;
  ActivityCode = ActivityCode;
  readonly DLMO_SCHEDULING_URL =
    'https://outlook.office365.com/owa/calendar/CircadiaStudy1@partnershealthcare.onmicrosoft.com/bookings/';

  onStartClick(activity: ActivityInstance): void {
    this.startActivity.emit(activity);
  }

  onContinueClick(activity: ActivityInstance): void {
    this.continueActivity.emit(activity);
  }

  onViewClick(activity: ActivityInstance): void {
    this.viewActivity.emit(activity);
  }
}
