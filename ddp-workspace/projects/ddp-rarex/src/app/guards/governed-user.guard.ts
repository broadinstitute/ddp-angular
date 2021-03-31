import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RoutePaths } from '../router-resources';
import { GovernedUserService } from '../services/governed-user.service';

@Injectable({
  providedIn: 'root',
})
export class GovernedUserGuard implements CanActivate {
  constructor(
    private router: Router,
    private governedUserService: GovernedUserService,
  ) {}

  canActivate(): Observable<boolean> {
    return this.governedUserService.isGoverned$.pipe(
      filter(isGoverned => isGoverned !== null),
      map(isGoverned => {
        if (!isGoverned) {
          this.router.navigateByUrl(RoutePaths.Dashboard);

          return false;
        }

        return true;
      }),
    );
  }
}
