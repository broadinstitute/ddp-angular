import { Component, OnInit } from '@angular/core';
import { AnalyticsEventsService, Auth0AdapterService, BrowserContentService, WindowRef } from "ddp-sdk";

@Component({
  selector: 'app-redirect-join',
  template: `
        <ng-container></ng-container>
    `
})
export class RedirectJoinComponent implements OnInit {
  public unsupportedBrowser: boolean;
  private readonly HEADER_HEIGHT: number = 70;

  constructor(
    private windowRef: WindowRef,
    private analytics: AnalyticsEventsService,
    private browserContent: BrowserContentService, private auth0Adapter: Auth0AdapterService) { }

  public ngOnInit(): void {
    this.unsupportedBrowser = this.browserContent.unsupportedBrowser();
    this.clickJoinUs();
  }
  public clickJoinUs(): void {
    sessionStorage.setItem('nextUrl', 'start-study');
    this.auth0Adapter.signup();
    this.doAnalytics();
    if (this.unsupportedBrowser) {
      this.browserContent.emitWarningEvent();
    }
  }
  private doAnalytics(): void {
    this.analytics.emitCustomEvent('clickedCountMeIn', 'fromMainPage');
  }

}
