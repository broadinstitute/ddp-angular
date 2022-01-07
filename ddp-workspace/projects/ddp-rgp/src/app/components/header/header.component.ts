import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { CompositeDisposable, SessionMementoService } from 'ddp-sdk';

import { Routes } from '../../routes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isLanguageSelectorVisible: boolean;
  public Routes = Routes;
  public isFamiliesMenuShown = false;
  public isResearchersMenuShown = false;
  public isProjectsMenuShown = false;
  public isMobileNavShown = false;
  public isHeaderWhite = false;
  private isHeaderWhiteRoute = false;
  private scrollYThreshold = 80;
  private whiteHeaderRoutes = [
    Routes.Home,
    Routes.EligibilityCriteria,
    Routes.LGMD,
    Routes.Craniofacial,
    Routes.Password,
  ];
  private anchor = new CompositeDisposable();

  constructor(private router: Router, private session: SessionMementoService) {}

  public ngOnInit(): void {
    this.setupRoutesListener();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public get isAuthenticated(): boolean {
    return this.session.isAuthenticatedSession();
  }

  @HostListener('document:click')
  public onWindowClick(): void {
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

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    const yPos = window.scrollY || 0;

    this.isHeaderWhite =
      this.isHeaderWhiteRoute || yPos > this.scrollYThreshold;
  }

  public onDropdownClick(target: string): void {
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

  private setupRoutesListener(): void {
    this.anchor.addNew(
      this.router.events.subscribe(e => {
        if (e instanceof NavigationEnd) {
          this.resetState();
          this.trackNavigation(e.urlAfterRedirects);
        }
      }),
    );
  }

  private trackNavigation(route: string): void {
    this.isHeaderWhiteRoute = this.whiteHeaderRoutes.includes(
      route.replace('/', '') as Routes,
    );
    this.isHeaderWhite = this.isHeaderWhiteRoute;
  }

  private resetState(): void {
    this.isFamiliesMenuShown = false;
    this.isProjectsMenuShown = false;
    this.isResearchersMenuShown = false;
    this.isMobileNavShown = false;
  }
}
