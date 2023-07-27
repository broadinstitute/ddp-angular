import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {SessionService} from '../services/session.service';

@Injectable()
export class UsersAndPermissionsCanLoadGuard implements CanLoad {
  constructor(
    private readonly router: Router,
    private readonly session: SessionService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    return this.session.selectedRealm === 'cmi-lms';
  }
}


@Injectable()
export class UsersAndPermissionsCanActivateGuard implements CanActivate {
  constructor(
    private readonly router: Router,
    private readonly session: SessionService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean | UrlTree {
    return this.session.selectedRealm === 'cmi-lms';
  }
}
