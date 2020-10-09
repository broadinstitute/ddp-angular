import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ActivityInstance } from 'ddp-sdk';

import { ActivityStatusCodes } from '../../constants/activity-status-codes';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.component.html',
  styleUrls: ['./workflow-progress.component.scss']
})
export class WorkflowProgressComponent {
  @Input() activityList: ActivityInstance[] = [];
  @Input() instanceGuid: string;
  @Output() changeActivity = new EventEmitter<ActivityInstance>();

  CompleteStatusCode = ActivityStatusCodes.COMPLETE;

  onWorkflowItemClick(activity: ActivityInstance) {
    this.changeActivity.emit(activity);
  }
}
