import { Component, Input } from '@angular/core';
import { ActivityInstance } from 'ddp-sdk';

export const CREATED = 'CREATED';
export const IN_PROGRESS = 'IN_PROGRESS';
export const COMPLETE = 'COMPLETE';

@Component({
  selector: 'app-workflow-progress',
  templateUrl: './workflow-progress.html',
  styleUrls: ['./workflow-progress.scss']
})
export class WorkflowProgressComponent {
  @Input() public steps: ActivityInstance[] = [];
  @Input() public instanceGuid: string;

  public CREATED = CREATED;
  public IN_PROGRESS = IN_PROGRESS;
  public COMPLETE = COMPLETE;
}
