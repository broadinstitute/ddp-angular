import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {Auth} from '../services/auth.service';
import {ComponentService} from '../services/component.service';

@Injectable()
export class CheckAuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const selectedRealm = localStorage.getItem(ComponentService.MENU_SELECTED_REALM);
    if (!this.auth.authenticated() && !selectedRealm) {return true;}
    else if (this.auth.authenticated() && !selectedRealm) {this.auth.logout();}
    else {this.router.navigate([selectedRealm]);}

    return false;
  }
}
