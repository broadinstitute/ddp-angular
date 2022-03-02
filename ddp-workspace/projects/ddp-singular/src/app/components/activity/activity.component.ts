import { Component } from '@angular/core';
import { Route } from '../../constants/route';
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
  Route = Route;
  isCaptchaResolved = true;

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
    return this.isActivityWithUnusualButtons() && this.isLastTwoSections;
  }

  get displayAgreeIcon(): boolean {
    return this.isActivityWithUnusualButtons();
  }

  get isLastTwoSections(): boolean {
    const totalSections = this.model.sections.length;

    return [totalSections, totalSections - 1].includes(this.currentSectionIndex + 1);
  }

  get isConsent(): boolean {
    return this.model?.activityCode === ActivityCode.ConsentSelf ||
      this.model?.activityCode === ActivityCode.ConsentAssent ||
      this.model?.activityCode === ActivityCode.ConsentParental;
  }

  onCaptchaResolve(): void {
    this.isCaptchaResolved = true;
  }

  private isActivityWithUnusualButtons(): boolean {
    return !this.isReadonly() && this.isConsent;
  }
}
