import { Component } from '@angular/core';

import { ActivityCode } from '../../constants/activity-code';

import {
  ActivityRedesignedComponent,
  SubmissionManager,
  SubmitAnnouncementService,
} from 'ddp-sdk';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class ActivityComponent extends ActivityRedesignedComponent {
  get isEnrollmentActivity(): boolean {
    return this.model.activityCode === ActivityCode.Enrollment;
  }

  public incrementStep(scroll = true): void {
    const nextIndex = this.nextAvailableSectionIndex();
    if (nextIndex !== -1) {
      if (scroll) {
        this.scrollToTop();
      }

      let shouldProceed = true;
      if (!this.model.readonly) {
        this.validationRequested = true;
        this.sendSectionAnalytics();
        this.currentSection.validate();
        shouldProceed = this.currentSection.valid;
      }

      if (shouldProceed) {
        this.resetValidationState();
        this.currentSectionIndex = nextIndex;
        this.visitedSectionIndexes[nextIndex] = true;
        if (!this.model.readonly) {
          this.saveLastVisitedSectionIndex(nextIndex);
        }
      }
    }
  }
}
