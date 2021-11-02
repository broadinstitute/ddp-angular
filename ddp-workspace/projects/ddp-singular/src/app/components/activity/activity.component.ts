import { Component, Input } from '@angular/core';
import { ActivityCode } from '../../constants/activity-code';
import { ActivityRedesignedComponent, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';
declare const DDP_ENV: Record<string, any>;


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  isCaptchaResolved = false;

  get isPrequal(): boolean {
    return this.model && this.model.activityCode === ActivityCode.Prequal;
  }

  get captchaSiteKey(): string {
    return DDP_ENV.recaptchaSiteClientKey;
  }

  onCaptchaResolve(): void {
    this.isCaptchaResolved = true;
  }
}
