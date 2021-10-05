import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivitiesComponent {
  ActivityStatusCode = ActivityStatusCodes;
  displayedColumns: string[] = ['name', 'status', 'actions'];
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
