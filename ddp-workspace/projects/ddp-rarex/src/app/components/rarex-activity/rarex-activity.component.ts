import { Component, Output, EventEmitter, Input } from '@angular/core';

import {
  ActivityComponent,
  SubmitAnnouncementService,
  SubmissionManager,
} from 'ddp-sdk';

import { ActivityCodes } from '../../constants/activity-codes';

@Component({
  selector: 'app-rarex-activity',
  templateUrl: './rarex-activity.component.html',
  styleUrls: ['./rarex-activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager],
})
export class RarexActivityComponent extends ActivityComponent {
  @Input() isReadonly = false;
  @Output() sectionChanged = new EventEmitter();
  private consentCodes: string[] = [
    ActivityCodes.CONSENT,
    ActivityCodes.CONSENT_ASSENT,
    ActivityCodes.PARENTAL_CONSENT,
  ];

  get isConsent(): boolean {
    return this.consentCodes.includes(this.model.activityCode);
  }

  scrollToTop(): void {
    super.scrollToTop();

    this.sectionChanged.emit();
  }
}
