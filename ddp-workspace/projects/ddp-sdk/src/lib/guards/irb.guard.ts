import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IrbPasswordService } from '../services/irbPassword.service';
import { SessionMementoService } from '../services/sessionMemento.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class IrbGuard implements CanActivate {
    constructor(
        private session: SessionMementoService,
        private irbPassword: IrbPasswordService,
        private router: Router) {
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (this.session.isAuthenticatedSession() || this.irbPassword.isIrbAuthenticated()) {
            return of(true);
        } else {
            return this.irbPassword.requiresIrbAuthentication().pipe(
                tap(passwordRequired => passwordRequired && this.router.navigate(['/password'])),
                map(passwordRequired => !passwordRequired));
        }
    }
}
