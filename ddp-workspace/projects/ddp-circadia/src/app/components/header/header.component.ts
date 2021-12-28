import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

import { CompositeDisposable, SessionMementoService } from 'ddp-sdk';

import { Route } from '../../constants/route';
import { AppAuth0AdapterService, SDKAuth0AdapterService } from '../../services/auth0Adapter.service';
import { EnrollmentPausedService } from '../../services/enrollment-paused.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    {
      provide: SDKAuth0AdapterService,
      useClass: AppAuth0AdapterService,
    }
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  Route = Route;
  isSticky = false;
  isEnrollmentPaused = this.enrollmentPausedService.isEnrollmentPaused;
  private isNavbarOpen$ = new BehaviorSubject<boolean>(false);
  private subs = new CompositeDisposable();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private sessionService: SessionMementoService,
    private enrollmentPausedService: EnrollmentPausedService,
  ) {}

  ngOnInit(): void {
    const bpSub = this.breakpointObserver
      .observe(['(max-width: 860px)'])
      .subscribe(() => {
        this.setIsNavbarOpen(false);
      });

    this.subs.addNew(bpSub);

    const openSub = this.isNavbarOpen$.subscribe(isOpen => {
      document.body.style.overflow = isOpen ? 'hidden' : 'visible';
    });

    this.subs.addNew(openSub);
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
  }

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }

  get isNavbarOpen(): boolean {
    return this.isNavbarOpen$.getValue();
  }

  setIsNavbarOpen(isOpen: boolean): void {
    this.isNavbarOpen$.next(isOpen);
  }

  onNavContainerClick(e: MouseEvent): void {
    const target = e.target as HTMLElement;

    if (['a', 'button'].includes(target.tagName.toLocaleLowerCase())) {
      e.stopPropagation();

      this.setIsNavbarOpen(false);
    }
  }

  onSignUpClick(): void {
    this.enrollmentPausedService.openDialog();
  }

  @HostListener('document:scroll')
  private onScroll(): void {
    this.isSticky = window.pageYOffset > 0;
  }
}
