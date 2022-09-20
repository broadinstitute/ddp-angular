import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';

import { ActivityRedesignedComponent, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';
import { Route } from '../../constants/route';
import { ActivityCode } from '../../constants/activity-code';
import { isConsentActivity, isMedicalRecordReleaseActivity } from '../../utils';
import { getFeatureFlags$ } from '../../config/feature-flags/feature-flags-setup';
import { FeatureFlags } from '../../config/feature-flags/feature-flags';
import { FeatureFlagsEnum } from '../../config/feature-flags/feature-flags.enum';

declare const DDP_ENV: Record<string, any>;

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  @Input('isLastOfMultipleActivities') isLastOfActivities = false;
  Route = Route;
  isCaptchaResolved = false;

  readonly featureFlag_DDP_8828 = getFeatureFlags$().pipe(
    map((flags: FeatureFlags) => flags[FeatureFlagsEnum.ShowDDP8828Captcha])
  );

  get isPrequal(): boolean {
    return this.model && this.model.activityCode === ActivityCode.Prequal;
  }

  get captchaSiteKey(): string {
    return DDP_ENV.recaptchaSiteClientKey;
  }

  get submitText(): string {
    return this.isActivityWithUnusualButtons() ? 'Activity.Actions.Agree' : 'SDK.SubmitButton';
  }

  get displayDisagreeButton(): boolean {
    return this.isActivityWithUnusualButtons() && this.isLastSection;
  }

  get displayAgreeIcon(): boolean {
    return this.isActivityWithUnusualButtons();
  }

  get isLastSection(): boolean {
    return this.model.sections.length - 1 === this.currentSectionIndex;
  }

  get isConsent(): boolean {
    return isConsentActivity(this.model?.activityCode);
  }

  get isMedicalRelease(): boolean {
    return isMedicalRecordReleaseActivity(this.model?.activityCode);
  }

  get shouldShowSectionsProgress(): boolean {
    return this.isConsent || this.isMedicalRelease;
  }

  onCaptchaResolve(): void {
    this.isCaptchaResolved = true;
  }

  private isActivityWithUnusualButtons(): boolean {
    return !this.isReadonly() && this.isConsent;
  }
}
