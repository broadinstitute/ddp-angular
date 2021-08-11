import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
})
export class UserActivitiesComponent {
  @Input() activities: ActivityInstance[] = [];
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();
  @Output() viewActivity = new EventEmitter<ActivityInstance>();
  @Output() updateActivity = new EventEmitter<ActivityInstance>();

  displayedColumns = ['name', 'summary', 'status', 'actions'];
  icons = {
    [ActivityStatusCodes.CREATED]: 'info',
    [ActivityStatusCodes.IN_PROGRESS]: 'pending',
    [ActivityStatusCodes.COMPLETE]: 'task_alt',
  };
  ActivityStatusCodes = ActivityStatusCodes;

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
}
