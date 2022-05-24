import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { bottomNavItems, topNavItems } from './navItems';
import { Auth } from '../../../services/auth.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NavigationComponent implements OnInit {
  readonly topNavigation = topNavItems;
  readonly botNavigation = bottomNavItems('Giorgi Charkviani');

  private readonly LSParams: string = 'pListQueryParams';
  qParams;

  constructor(private auth: Auth, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      localStorage.setItem(this.LSParams,
        JSON.stringify({from: params?.from || 0, to: params?.to || 10}));

      this.qParams = JSON.parse(localStorage.getItem(this.LSParams));
    });
  }

  signOut(allow: boolean): void {
    allow && this.auth.logout();
  }
}
