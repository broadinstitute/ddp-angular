import { Component } from '@angular/core';

import {
  AnalyticsEventActions,
  AnalyticsEventCategories,
  AnalyticsEventsService,
  SessionMementoService,
} from 'ddp-sdk';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly rarexLink = 'https://rare-x.org/';

  constructor(
    private session: SessionMementoService,
    private analytics: AnalyticsEventsService,
  ) {}

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public sendAnalytics(): void {
    this.analytics.emitCustomEvent(
      AnalyticsEventCategories.ClickedCountMeIn,
      AnalyticsEventActions.FromHeader,
    );
  }
}
