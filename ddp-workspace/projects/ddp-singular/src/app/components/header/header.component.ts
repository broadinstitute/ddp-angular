import { Component } from '@angular/core';
import { SessionMementoService, AnalyticsEventsService } from 'ddp-sdk';

import { Route } from '../../constants/route';
import { GTagEvent } from '../../constants/gtag-event';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  Route = Route;

  private _isNavigationShown = false;

  constructor(
    private readonly sessionService: SessionMementoService,
    private readonly analytics: AnalyticsEventsService
  ) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }

  get isNavigationShown(): boolean {
    return this._isNavigationShown;
  }

  set isNavigationShown(isShown) {
    if (isShown) {
      // Prevent scrolling on body when navigation is shown
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    this._isNavigationShown = isShown;
  }

  onToggleClick(): void {
    this.isNavigationShown = !this.isNavigationShown;
  }

  onNavClick(e: MouseEvent): void {
    const clickTarget = e.target as HTMLElement;
    const tagName = clickTarget.tagName.toLowerCase();

    if (['a', 'button'].includes(tagName)) {
      this.isNavigationShown = false;
    }
  }

  signIn(): void {
    this.analytics.emitCustomGtagEvent(GTagEvent.LOG_IN_CLICK);
  }

  signUp(event: Event): void {
    const link = event.currentTarget as HTMLAnchorElement;
    this.analytics.emitCustomGtagEvent(GTagEvent.SIGN_UP_CLICK, link.innerText, link.href);
  }
}
