import { Component } from '@angular/core';

import { Route } from '../../constants/Route';
import {AnalyticsEventsService} from "ddp-sdk";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  constructor(private analytics: AnalyticsEventsService) {
    this.analytics.emitNavigationEvent();
  }

  readonly Route = Route;
}
