import { Component } from '@angular/core';

@Component({
  selector: `app-activity`,
  styleUrls: ['./activity.scss'],
  template: `
    <div class="activity">
      <app-header></app-header>
      <div class="page-padding content">
        <ddp-activity-redesigned></ddp-activity-redesigned>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class ActivityComponent {
}
