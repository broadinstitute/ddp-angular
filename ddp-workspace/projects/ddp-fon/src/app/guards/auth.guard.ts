import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionMementoService } from 'ddp-sdk';

import { Route } from '../constants/Route';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionMementoService) {}

  canActivate(): Observable<boolean> {
    return this.sessionService.sessionObservable.pipe(
      map(() => this.sessionService.isAuthenticatedSession()),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl(Route.Login);

          return false;
        }

        return true;
      }),
    );
  }
}
