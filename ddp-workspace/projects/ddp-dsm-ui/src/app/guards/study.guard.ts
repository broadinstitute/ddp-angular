import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';
import {SessionService} from '../services/session.service';

@Injectable({providedIn: 'root'})
export class StudyGuard implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const selectedRealm = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);

    if(this.allowAccessToStudy(selectedRealm, state)) {return true;}

    this.router.navigate([selectedRealm || '']);

    return false;
  }

  private allowAccessToStudy(selectedRealm: string, state: RouterStateSnapshot): boolean {
    return localStorage.getItem(Auth.AUTH0_TOKEN_NAME)
      && localStorage.getItem(SessionService.DSM_TOKEN_NAME)
      && selectedRealm === state.url.slice(1);
  }
}
