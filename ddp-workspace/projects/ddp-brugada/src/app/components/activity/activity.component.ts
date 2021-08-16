import { Component, Input } from '@angular/core';

import { ActivityRedesignedComponent, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';

import { ActivityCode } from '../../constants/activity-code';

declare const DDP_ENV: Record<string, any>;

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  @Input() isPrequal = false;
  ActivityCode = ActivityCode;
  isCaptchaResolved = false;

  get captchaSiteKey(): string {
    return DDP_ENV.recaptchaSiteClientKey;
  }

  onCaptchaResolve(): void {
    this.isCaptchaResolved = true;
  }
}
