import { Component } from '@angular/core';
import { ActivityRedesignedComponent } from 'ddp-sdk';

import { SubmitButtonPlacement } from '../../types';
import { isAboutYouOrChildActivity } from '../../utils';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styles: [`
      .activity-buttons-middle {
          margin: 2rem 0 4rem;
      }
  `]
})
export class ActivityComponent extends ActivityRedesignedComponent {
  SubmitButtonPlacement = SubmitButtonPlacement;

  get submitButtonPlacement(): SubmitButtonPlacement {
    return isAboutYouOrChildActivity(this.model?.activityCode)
    ? SubmitButtonPlacement.BeforeClosingSection
    : SubmitButtonPlacement.AfterClosingSection;
  }
}
