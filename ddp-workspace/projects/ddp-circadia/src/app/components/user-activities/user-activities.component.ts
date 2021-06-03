import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent {
  displayedColumns = ['name', 'status', 'actions'];
  ActivityStatusCode = ActivityStatusCodes;
  @Input() activities: ActivityInstance[];
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();
  @Output() viewActivity = new EventEmitter<ActivityInstance>();

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
