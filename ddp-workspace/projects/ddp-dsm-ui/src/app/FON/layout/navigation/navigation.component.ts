import { ChangeDetectionStrategy, Component } from '@angular/core';
import { bottomNavItems, topNavItems } from './navItems';
import { Auth } from '../../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavigationComponent {
  readonly topNavigation = topNavItems;
  readonly botNavigation = bottomNavItems('Giorgi Charkviani');

  constructor(private auth: Auth) {
  }

  signOut(allow: boolean): void {
    allow && this.auth.logout();
  }
}
