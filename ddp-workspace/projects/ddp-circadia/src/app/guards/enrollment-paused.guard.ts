import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Route } from '../constants/route';

declare const DDP_ENV: Record<string, any>;

@Injectable({
  providedIn: 'root',
})
export class EnrollmentPausedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const { enrollmentPaused } = DDP_ENV;

    if (enrollmentPaused) {
      this.router.navigateByUrl(Route.Home);

      return false;
    }

    return true;
  }
}
