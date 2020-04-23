import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { WindowRef, SessionMementoService, AnalyticsEventsService, AnalyticsEventCategories, AnalyticsEventActions, Auth0AdapterService } from 'ddp-sdk';
import { HeaderConfigurationService, CommunicationService } from 'toolkit';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public isPanelOpened = false;
  public isPageScrolled = false;

  constructor(
    private session: SessionMementoService,
    private window: WindowRef,
    private router: Router,
    private communicationService: CommunicationService,
    public headerConfig: HeaderConfigurationService,
    private analytics: AnalyticsEventsService,
    public auth0: Auth0AdapterService,
    @Inject(DOCUMENT) private document: any) { }

  public ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isPanelOpened = false;
      }
    });
  }

  public openCloseMenu(): void {
    this.isPanelOpened = !this.isPanelOpened;
  }

  public openJoinMailingList(): void {
    this.communicationService.openJoinDialog();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  public sendAnalytics(): void {
    this.analytics.emitCustomEvent(AnalyticsEventCategories.ClickedCountMeIn, AnalyticsEventActions.FromHeader);
  }

  @HostListener('window: scroll') public onWindowScroll(): void {
    const scrolledPixels = this.window.nativeWindow.pageYOffset
      || this.document.documentElement.scrollTop
      || this.document.body.scrollTop || 0;
    this.isPageScrolled = !!scrolledPixels;
  }
}
