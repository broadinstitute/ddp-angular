import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { bottomNavItems, topNavItems } from './navItems';
import { Auth } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  readonly topNavigation = topNavItems;
  readonly botNavigation = bottomNavItems(this.getUserName());

  constructor(
    private auth: Auth,
    private sessionService: SessionService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  signOut(allow: boolean): void {
    allow && this.auth.logout();
  }

  navigateTo(route: string) {
    console.log(route);
  }

  private getUserName(): string {
    const authToken = localStorage.getItem(Auth.AUTH0_TOKEN_NAME);
    return (
      this.sessionService.getDSMClaims(authToken).name || 'Administrator name'
    );
  }
}
