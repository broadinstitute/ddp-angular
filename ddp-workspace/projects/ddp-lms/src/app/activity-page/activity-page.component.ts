import { Component } from '@angular/core';
import { ActivityRedesignedComponent } from 'toolkit';

@Component({
  selector: 'app-activity-page',
  template: `
    <app-activity
      [studyGuid]="studyGuid"
      [activityGuid]="instanceGuid"
      [agreeConsent]="config.agreeConsent"
      (submit)="navigate($event)"
      (stickySubtitle)="showStickySubtitle($event)"
      (activityCode)="activityCodeChanged($event)">
    </app-activity>
  `,
})
export class ActivityPageComponent extends ActivityRedesignedComponent {}
