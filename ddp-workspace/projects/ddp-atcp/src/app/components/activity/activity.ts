import { Component } from '@angular/core';
import { HeaderConfigurationService } from 'toolkit';

@Component({
  selector: `app-activity`,
  styleUrls: ['./activity.scss'],
  template: `
    <div class="activity">
      <app-header></app-header>
      <div class="page-padding">
        <app-workflow-progress [currentActivityCode]="headerConfig.currentActivityCode"
                               [workflowStartSectionsVisibility]="headerConfig.workflowStartSectionsVisibility">
        </app-workflow-progress>
        <toolkit-activity-redesigned></toolkit-activity-redesigned>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class ActivityComponent {
  constructor(public headerConfig: HeaderConfigurationService) {
  }
}
