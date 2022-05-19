import {Injectable} from '@angular/core';
import {
  ActivatedRoute,
  CanLoad,
  Route,
  Router,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';

@Injectable()
export class CheckAuthGuard implements CanLoad {
  constructor(private auth: Auth, private router: Router, private route: ActivatedRoute) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const selectedRealm = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);

    if (!this.auth.authenticated() && !selectedRealm) {
      return true;
    }
    else if (this.auth.authenticated() && !selectedRealm) {
      this.auth.logout();
      return this.router.createUrlTree(['']);
    }
    else {
      return this.router.createUrlTree([selectedRealm]);
    }
  }
}
