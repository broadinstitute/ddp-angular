import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityInstance } from './../../../../../ddp-sdk/src/lib/models/activityInstance';


@Component({
  template: ''
})
export abstract class BaseActivities {
  abstract displayedColumns: string[];

  @Input() activities: ActivityInstance[];
  @Output() viewActivity = new EventEmitter<ActivityInstance>();
  @Output() startActivity = new EventEmitter<ActivityInstance>();
  @Output() continueActivity = new EventEmitter<ActivityInstance>();

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
