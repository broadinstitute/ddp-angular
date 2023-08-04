import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {RoleService} from '../services/role.service';

@Injectable()
export class UsersAndPermissionsCanLoadGuard implements CanLoad {
  constructor(private readonly roleService: RoleService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    return this.roleService.isStudyUserAdmin || this.roleService.isPepperAdmin;
  }
}


@Injectable()
export class UsersAndPermissionsCanActivateGuard implements CanActivate {
  constructor(private readonly roleService: RoleService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  boolean | UrlTree {
    return this.roleService.isStudyUserAdmin || this.roleService.isPepperAdmin;
  }
}
