import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
      mergeMap(isGoverned => {
        if (isGoverned === null) {
          return this.governedUserService.checkIfGoverned();
        }

        return of(isGoverned);
      }),
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
