import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { SessionMementoService } from '../../../../../ddp-sdk/src/lib/services/sessionMemento.service';
import { WindowRef } from '../../../../../ddp-sdk/src/lib/services/windowRef';
import { AnalyticsEventsService } from '../../../../../ddp-sdk/src/lib/services/analyticsEvents.service';
import { AnalyticsEventCategories } from '../../../../../ddp-sdk/src/lib/models/analyticsEventCategories';
import { AnalyticsEventActions } from '../../../../../ddp-sdk/src/lib/models/analyticsEventActions';
import { CommunicationService } from '../../../../../toolkit/src/lib/services/communication.service';
import { HeaderConfigurationService } from '../../../../../toolkit/src/lib/services/headerConfiguration.service';

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
