import { Component, ViewEncapsulation, Inject, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { WindowRef, SessionMementoService } from 'ddp-sdk';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  public inHome = true;
  public inLGMD = true;
  public inEligiblityCrit = true;
  public isCollapsed = true;
  public isForFamiliesCollapsed = true;
  public isForResearchersCollapsed = true;
  public isSpecialtyProjectsCollapsed = true;
  public isPageScrolled = false;

  constructor(
    private router: Router,
    private window: WindowRef,
    private session: SessionMementoService,
    @Inject(DOCUMENT) private document: any) { }

  public ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCollapsed = true;
        this.trackNavigation(event.urlAfterRedirects);
      }
    });
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  @HostListener('window: scroll') public onWindowScroll(): void {
    const scrolledPixels = this.window.nativeWindow.pageYOffset
      || this.document.documentElement.scrollTop
      || this.document.body.scrollTop || 0;
    this.isPageScrolled = !!scrolledPixels;
  }

  private trackNavigation(route: string): void {
    if (route === null || route === undefined || route === '/' ||
      route.indexOf('/password') === 0 || route.indexOf('/limb-girdle-muscular-dystrophy') === 0 ||
      route.indexOf('/craniofacial') === 0 || route.indexOf('/eligibility-criteria') === 0) {
      this.inHome = true;
      this.inLGMD = true;
      this.inEligiblityCrit = true;
      return;
    }

    if (route.indexOf('/about-us') === 0) {
      this.inHome = false;
      this.inLGMD = false;
      this.inEligiblityCrit = false;
      return;
    }

    this.inLGMD = false;
    this.inHome = false;
    this.inEligiblityCrit = false;
  }
}
