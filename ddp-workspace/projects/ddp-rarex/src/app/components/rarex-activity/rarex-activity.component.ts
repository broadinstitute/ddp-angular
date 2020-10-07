import { Component, Output, EventEmitter } from '@angular/core';

import { ActivityComponent, SubmitAnnouncementService, SubmissionManager } from 'ddp-sdk';

import { ActivityCodes } from '../../constants/activity-codes';

@Component({
  selector: 'app-rarex-activity',
  templateUrl: './rarex-activity.component.html',
  styleUrls: ['./rarex-activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager]
})
export class RarexActivityComponent extends ActivityComponent {
  @Output() sectionChanged = new EventEmitter();

  scrollToTop() {
    super.scrollToTop();

    this.sectionChanged.emit();
  }

  public get showStepper(): boolean {
    return this.model.activityCode === ActivityCodes.CONSENT || this.model.sections.some(section => section.name || section.icons.length);
  }
}
