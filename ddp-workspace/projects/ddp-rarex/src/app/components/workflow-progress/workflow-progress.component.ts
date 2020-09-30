import { Component, Input } from '@angular/core';

import { ActivityInstance } from 'ddp-sdk';

import { ActivityStatusCodes } from '../../constants/activity-status-codes';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.component.html',
  styleUrls: ['./workflow-progress.component.scss']
})
export class WorkflowProgressComponent {
  CompleteStatusCode = ActivityStatusCodes.COMPLETE;

  @Input() activityList: ActivityInstance[] = [];
  @Input() instanceGuid: string;
}
