import { Component } from '@angular/core';
import { ActivityCode } from '../../constants/activity-code';
import { ActivityRedesignedComponent, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  get isPrequal(): boolean {
    return this.model && this.model.activityCode === ActivityCode.Prequal;
  }
}
