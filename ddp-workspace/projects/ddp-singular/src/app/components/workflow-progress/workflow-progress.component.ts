import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.component.html',
  styleUrls: ['./workflow-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowProgressComponent {
  @Input() instanceGuid: string;
  @Input() activityList: ActivityInstance[] = [];
  @Output() changeActivity = new EventEmitter<ActivityInstance>();

  CompleteStatusCode = ActivityStatusCodes.COMPLETE;

  onWorkflowItemClick(activity: ActivityInstance): void {
    if (activity.instanceGuid !== this.instanceGuid) {
      this.changeActivity.emit(activity);
    }
  }

  getActivityStatusCode(activity: ActivityInstance): ActivityStatusCodes {
    if (!!activity.previousInstanceGuid) {
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
