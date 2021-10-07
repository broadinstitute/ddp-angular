import { ActivityStatusCodes } from 'ddp-sdk';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseActivities } from '../base-activities/base-activities.component';


@Component({
  selector: 'app-user-activities',
  templateUrl: './user-activities.component.html',
  styleUrls: ['./user-activities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserActivitiesComponent extends BaseActivities {
  ActivityStatusCode = ActivityStatusCodes;
  displayedColumns: string[] = ['name', 'status', 'actions'];
}
