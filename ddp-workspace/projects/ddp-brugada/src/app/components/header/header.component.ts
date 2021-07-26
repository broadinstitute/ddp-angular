import { Component } from '@angular/core';

import { Route } from '../../constants/Route';
import { MatDialog } from '@angular/material/dialog';
import { MailingListModalComponent } from '../mailing-list-modal/mailing-list-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  Route = Route;
  private _isNavigationShown = false;

  constructor(private dialog: MatDialog) {
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

  openMailingListModal(): void {
    this.dialog.open(MailingListModalComponent, {
      width: '100%',
      maxWidth: '640px',
      disableClose: true,
      autoFocus: false,
    });

  }
}
