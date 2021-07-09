import { ActivityStatusCodes } from 'ddp-sdk';
import { ActivityCode } from '../../constants/activity-code';
import { Component, EventEmitter, Output } from '@angular/core';
import { BaseActivities } from '../base-activities/base-activities.component';


@Component({
  selector: 'app-release-requests',
  templateUrl: './release-requests.component.html',
  styleUrls: ['./release-requests.component.scss']
})
export class ReleaseRequestsComponent extends BaseActivities {
  ActivityCode = ActivityCode;
  ActivityStatusCode = ActivityStatusCodes;

  displayedColumns: string[] = ['name', 'dateCreate', 'actions'];

  @Output() startNewActivity = new EventEmitter<ActivityCode>();

  addActivity(code: ActivityCode): void {
    this.startNewActivity.emit(code);
  }
}
