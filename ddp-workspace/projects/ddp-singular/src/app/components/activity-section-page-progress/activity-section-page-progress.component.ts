import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity-section-page-progress',
  template: `
    <h3 class="progress-title">Page {{ current }} of {{ total }}</h3>
  `,
  styleUrls: ['./activity-section-page-progress.component.scss'],
})
export class ActivitySectionPageProgressComponent {
  @Input() current: number;
  @Input() total: number;
}
