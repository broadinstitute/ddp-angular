import { Injectable, Inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { IrbPasswordService } from '../services/irbPassword.service';
import { ConfigurationService } from '../services/configuration.service';
import { SessionMementoService } from '../services/sessionMemento.service';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable()
export class IrbGuard implements CanActivate {
    constructor(
        private session: SessionMementoService,
        private irbPassword: IrbPasswordService,
        private router: Router,
        @Inject('ddp.config') private config: ConfigurationService) {
    }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (this.session.isAuthenticatedSession() || this.irbPassword.isIrbAuthenticated()) {
            return of(true);
        } else {
            return this.irbPassword.requiresIrbAuthentication().pipe(
                tap(passwordRequired => passwordRequired && this.router.navigateByUrl(this.config.passwordPageUrl)),
                map(passwordRequired => !passwordRequired),
                catchError(() => {
                    this.router.navigateByUrl(this.config.errorPageUrl);
                    return of(false);
                })
            );
        }
    }
}
