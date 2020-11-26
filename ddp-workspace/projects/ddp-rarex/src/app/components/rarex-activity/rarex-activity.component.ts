import { Component, Output, EventEmitter, Input } from '@angular/core';

import { ActivityComponent, SubmitAnnouncementService, SubmissionManager } from 'ddp-sdk';

@Component({
  selector: 'app-rarex-activity',
  templateUrl: './rarex-activity.component.html',
  styleUrls: ['./rarex-activity.component.scss'],
  providers: [SubmitAnnouncementService, SubmissionManager]
})
export class RarexActivityComponent extends ActivityComponent {
  @Input() isReadonly = false;
  @Output() sectionChanged = new EventEmitter();

  scrollToTop() {
    super.scrollToTop();

    this.sectionChanged.emit();
  }
}
