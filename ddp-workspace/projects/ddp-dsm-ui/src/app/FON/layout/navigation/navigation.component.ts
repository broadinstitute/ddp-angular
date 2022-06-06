import {ChangeDetectionStrategy, Component} from '@angular/core';

import { bottomNavItems, topNavItems } from './navItems';
import { Auth } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavigationComponent {
  readonly topNavigation = topNavItems;
  readonly botNavigation = bottomNavItems(this.getUserName());

  constructor(
    private auth: Auth,
    private sessionService: SessionService
  ) {}

  signOut(allow: boolean): void {
    allow && this.auth.logout();
  }

  private getUserName(): string {
    const authToken = localStorage.getItem(Auth.AUTH0_TOKEN_NAME);
    return this.sessionService.getDSMClaims(authToken).name || 'Administrator name';
  }
}
