import {Injectable} from '@angular/core';
import {
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
  constructor(private auth: Auth, private router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const selectedRealm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);

    if (!this.auth.authenticated() && !selectedRealm) {
      return true;
    }
    else if (this.auth.authenticated() && !selectedRealm) {
      this.auth.sessionLogout();
      return this.router.createUrlTree(['']);
    } else if (!this.auth.authenticated() && selectedRealm) {
      this.auth.doLogout();
      return this.router.createUrlTree(['']);
    }
    else {
      return this.router.createUrlTree([selectedRealm]);
    }
  }
}
