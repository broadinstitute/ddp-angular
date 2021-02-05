import {
  Component,
  ViewEncapsulation,
  Inject,
  HostListener,
  OnInit,
  ElementRef,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { WindowRef, SessionMementoService } from 'ddp-sdk';

import { Routes } from '../../routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  public Routes = Routes;
  public isFamiliesMenuShown = false;
  public isResearchersMenuShown = false;
  public isProjectsMenuShown = false;
  public isMobileNavShown = false;

  public inHome = true;
  public inLGMD = true;
  public inEligiblityCrit = true;
  public isCollapsed = true;
  public isForFamiliesCollapsed = true;
  public isForResearchersCollapsed = true;
  public isSpecialtyProjectsCollapsed = true;
  public isPageScrolled = false;

  constructor(
    private host: ElementRef,
    private router: Router,
    private window: WindowRef,
    private session: SessionMementoService,
    @Inject(DOCUMENT) private document: any,
  ) {}

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

  @HostListener('document:click')
  public onWindowClick(e: MouseEvent): void {
    this.isFamiliesMenuShown = false;
    this.isResearchersMenuShown = false;
    this.isProjectsMenuShown = false;
    this.isMobileNavShown = false;
  }

  @HostListener('window:resize', ['$event'])
  public onWindowResize(e: Event): void {
    const window = e.target as Window;

    if (this.isMobileNavShown && window.innerWidth > 920) {
      this.isMobileNavShown = false;
    }
  }

  @HostListener('window: scroll') public onWindowScroll(): void {
    const scrolledPixels =
      this.window.nativeWindow.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop ||
      0;
    this.isPageScrolled = !!scrolledPixels;
  }

  public onDropdownClick(e: Event, target: string): void {
    e.stopPropagation();

    this.isFamiliesMenuShown = false;
    this.isResearchersMenuShown = false;
    this.isProjectsMenuShown = false;

    if (target === 'families') {
      this.isFamiliesMenuShown = true;
    } else if (target === 'researchers') {
      this.isResearchersMenuShown = true;
    } else if (target === 'projects') {
      this.isProjectsMenuShown = true;
    }
  }

  public onToggleClick(e: Event): void {
    e.stopPropagation();

    this.isMobileNavShown = !this.isMobileNavShown;
  }

  private trackNavigation(route: string): void {
    if (
      route === null ||
      route === undefined ||
      route === '/' ||
      route.indexOf('/password') === 0 ||
      route.indexOf('/limb-girdle-muscular-dystrophy') === 0 ||
      route.indexOf('/craniofacial') === 0 ||
      route.indexOf('/eligibility-criteria') === 0
    ) {
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
