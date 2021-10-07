import { Component, Output, EventEmitter, Input } from '@angular/core';

import {
  ActivityComponent as SDKActivityComponent,
  SubmitAnnouncementService,
  SubmissionManager,
} from 'ddp-sdk';

import { ActivityCodes } from '../../constants/activity-codes';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends SDKActivityComponent {
  @Input() isInitiallyReadonly = false;
  @Input() hasPreviousInstance = false;
  @Output() sectionChanged = new EventEmitter();
  private consentCodes: string[] = [
    ActivityCodes.SelfConsent,
    ActivityCodes.ConsentAssent,
    ActivityCodes.ParentalConsent,
    ActivityCodes.LarConsent,
    ActivityCodes.LarConsentAssent,
  ];

  get isConsent(): boolean {
    return this.consentCodes.includes(this.model.activityCode);
  }

  isReadonly(): boolean {
    return this.model.readonly || this.isInitiallyReadonly;
  }

  scrollToTop(): void {
    super.scrollToTop();

    this.sectionChanged.emit();
  }

  jumpStep(step: number): void {
    if (this.hasPreviousInstance) {
      this.currentSectionIndex = step;

      return;
    }

    super.jumpStep(step);
  }

  isCompleted(step: number): boolean {
    return this.visitedSectionIndexes[step] || this.hasPreviousInstance;
  }
}
