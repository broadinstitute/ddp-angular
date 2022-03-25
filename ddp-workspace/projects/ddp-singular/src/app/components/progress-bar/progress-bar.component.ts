import { Component, Input } from '@angular/core';
import { ActivityInstance } from 'ddp-sdk';

import { getRenderActivities, RenderActivity } from '../../utils';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  renderActivities: RenderActivity[] | null = null;
  @Input() instanceGuid: string | null = null;
  @Input() hidden = false;

  @Input() set activities(activities: ActivityInstance[]) {
    if (activities) {
      this.renderActivities = getRenderActivities(this.instanceGuid, activities);
    }
  }

  get isProgressBarDisplayed(): boolean {
    return this.renderActivities !== null && !this.hidden;
  }
}
