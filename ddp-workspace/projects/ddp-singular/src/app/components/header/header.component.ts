import { Component, OnInit } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { Route } from '../../constants/route';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  Route = Route;

  private _isNavigationShown = false;

  constructor(
    private readonly sessionService: SessionMementoService
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
}
