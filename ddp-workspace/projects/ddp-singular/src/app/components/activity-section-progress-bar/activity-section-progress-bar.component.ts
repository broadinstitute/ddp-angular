import { Component, Input } from '@angular/core';

import { ActivityForm } from 'ddp-sdk';

@Component({
  selector: 'app-activity-section-progress-bar',
  styleUrls: ['./activity-section-progress-bar.component.scss'],
  template: `
    <div class="section-progress-bar">
      <div
        *ngFor="let section of sections; index as idx; last as isLast"
        class="block"
        [class.last-block]="isLast"
        [class.completed]="idx <= currentIndex"
        style="width: {{ 100 / sections.length }}%">
      </div>
    </div>
  `,
})
export class ActivitySectionProgressBarComponent {
  @Input() sections: ActivityForm['sections'];
  @Input() currentIndex: number;
}
