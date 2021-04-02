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
  @Input() isReadonly = false;
  @Output() sectionChanged = new EventEmitter();
  private consentCodes: string[] = [
    ActivityCodes.SelfConsent,
    ActivityCodes.ConsentAssent,
    ActivityCodes.ParentalConsent,
  ];

  get isConsent(): boolean {
    return this.consentCodes.includes(this.model.activityCode);
  }

  scrollToTop(): void {
    super.scrollToTop();

    this.sectionChanged.emit();
  }
}
