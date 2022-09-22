import { Component, Input } from '@angular/core';
import { Route } from '../../constants/route';
import { ActivityCode } from '../../constants/activity-code';
import { isConsentActivity, isMedicalRecordReleaseActivity } from '../../utils';
import { ActivityRedesignedComponent, RuntimeEnvironment, SubmissionManager, SubmitAnnouncementService } from 'ddp-sdk';

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

  get isPrequal(): boolean {
    return this.model && this.model.activityCode === ActivityCode.Prequal;
  }

  get captchaSiteKey(): string {
    return (this.config.runtimeEnvironment === RuntimeEnvironment.Test) ?
      DDP_ENV.recaptchaSiteClientKeyForAutoTests // disable captcha check for auto-tests on test env
      : DDP_ENV.recaptchaSiteClientKey;
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
