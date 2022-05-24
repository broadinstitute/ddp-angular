import { Component } from '@angular/core';

import { ActivityRedesignedComponent, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';

import { ActivityCode } from '../../constants/activity-code';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  ActivityCode = ActivityCode;
}
