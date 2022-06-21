import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {
  AnalyticsEventActions,
  AnalyticsEventCategories,
  AnalyticsEventsService,
  SessionMementoService,
  WindowRef,
} from 'ddp-sdk';
import { NavigationEnd, Router } from '@angular/router';
import { CommunicationService, HeaderConfigurationService } from 'toolkit';
import { DOCUMENT } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable } from 'rxjs';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isPanelOpened = false;
  public isPageScrolled = false;
  public showHamburgerVersion$: Observable<boolean> = this.breakPointObserver
    .observe(['(max-width: 1235px)'])
    .pipe(map((result) => result.matches));

  constructor(
    private session: SessionMementoService,
    private window: WindowRef,
    private router: Router,
    private communicationService: CommunicationService,
    private analytics: AnalyticsEventsService,
    private breakPointObserver: BreakpointObserver,
    public headerConfig: HeaderService,
    @Inject(DOCUMENT) private document: any
  ) {}

  public ngOnInit(): void {
    this.router.events.subscribe((event) => {
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

  onLogoClick(): void {
    this.headerConfig.setupDefaultHeader();
  }

  @HostListener('window: scroll') public onWindowScroll(): void {
    const scrolledPixels =
      this.window.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;
    this.isPageScrolled = !!scrolledPixels;
  }

  @HostListener('window: resize') public onWindowResize(): void {
    this.isPanelOpened = false;
  }
}
