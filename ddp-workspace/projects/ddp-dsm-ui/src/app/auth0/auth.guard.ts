import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '../services/auth.service';
import { SessionService } from '../services/session.service';
import { DSMService } from '../services/dsm.service';
import { Statics } from '../utils/statics';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private auth: Auth) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem(Auth.AUTH0_TOKEN_NAME) && localStorage.getItem(SessionService.DSM_TOKEN_NAME)) {
      // logged in so return true
      return true;
    }

    if (state.url !== Statics.HOME_URL && !this.auth.authenticated()) {
      if (state.url.indexOf(Statics.PERMALINK_URL) === 0) {
        let link;
        if (state.url.indexOf('participantList') > -1 ||
          state.url.indexOf(Statics.MEDICALRECORD) > -1) {
          const realm: string = route.queryParams[ DSMService.REALM ];
          link = {link: state.url, realm};
        } else if (state.url.indexOf(Statics.SHIPPING) > -1) {
          const target: string = route.queryParams[ DSMService.TARGET ];
          link = {link: state.url, target};
        } else {
          link = {link: state.url};
        }
        localStorage.setItem(Statics.PERMALINK, JSON.stringify(link));
      }
    }
    return false;
  }
}
