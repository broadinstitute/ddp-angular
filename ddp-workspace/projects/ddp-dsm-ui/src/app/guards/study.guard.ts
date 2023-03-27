import {Injectable} from '@angular/core';
import {Router, CanLoad, Route, UrlSegment, UrlTree} from '@angular/router';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {SessionService} from '../services/session.service';

@Injectable({providedIn: 'root'})
export class StudyGuard implements CanLoad {

  constructor(private router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const selectedRealm = sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    const allowed = this.allowAccessToStudy(selectedRealm, segments[0].path);


    return allowed ? allowed : this.router.createUrlTree(['']);
  }

  private allowAccessToStudy(selectedRealm: string, state: string): boolean {
    return sessionStorage.getItem(Auth.AUTH0_TOKEN_NAME)
      && sessionStorage.getItem(SessionService.DSM_TOKEN_NAME)
      && selectedRealm === state;
  }
}
