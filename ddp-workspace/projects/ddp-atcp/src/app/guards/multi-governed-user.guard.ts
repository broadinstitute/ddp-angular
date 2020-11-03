import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { MultiGovernedUserService } from '../services/multi-governed-user.service';
import * as RouterResources from '../router-resources';

@Injectable({
  providedIn: 'root',
})
export class MultiGovernedUserGuard implements CanActivate {
  constructor(
    private router: Router,
    private multiGovernedUserService: MultiGovernedUserService
  ) {}

  canActivate(): Observable<boolean> {
    return this.multiGovernedUserService.isMultiGoverned$.asObservable().pipe(
      filter(isMultiGoverned => isMultiGoverned !== null),
      map(isMultiGoverned => {
        if (isMultiGoverned) {
          return true;
        }

        this.router.navigateByUrl(RouterResources.Dashboard);

        return false;
      })
    );
  }
}
