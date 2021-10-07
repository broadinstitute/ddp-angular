import { ActivityStatusCodes } from 'ddp-sdk';
import { ActivityCode } from '../../constants/activity-code';
import { BaseActivities } from '../base-activities/base-activities.component';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-release-requests',
  templateUrl: './release-requests.component.html',
  styleUrls: ['./release-requests.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
