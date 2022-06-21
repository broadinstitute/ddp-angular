import {ChangeDetectionStrategy, Component} from '@angular/core';

import { bottomNavItems, topNavItems } from './navItems';
import { Auth } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import {ActivatedRoute} from '@angular/router';

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
    private sessionService: SessionService,
    private activatedRoute: ActivatedRoute
  ) {}

  signOut(allow: boolean): void {
    allow && this.auth.logout();
  }

  private getUserName(): string {
    const authToken = localStorage.getItem(Auth.AUTH0_TOKEN_NAME);
    return this.sessionService.getDSMClaims(authToken).name || 'Administrator name';
  }

  isActive(route: string): boolean {
    const passedRoute = route === '/fon' ? '' : route;
    return passedRoute === this.activatedRoute.firstChild.snapshot.routeConfig.path;
  }
}
