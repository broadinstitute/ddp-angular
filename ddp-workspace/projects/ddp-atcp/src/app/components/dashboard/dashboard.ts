import { Component } from '@angular/core';

@Component({
  selector: `app-dashboard`,
  styleUrls: ['./dashboard.scss'],
  template: `
    <div class="dashboard">
      <app-header></app-header>
      <div class="page-padding">
        <toolkit-dashboard [hideHeader]="true" [showText]="true"></toolkit-dashboard>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class DashBoardComponent {
}
