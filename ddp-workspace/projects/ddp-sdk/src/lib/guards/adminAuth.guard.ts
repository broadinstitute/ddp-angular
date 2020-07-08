import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SessionMementoService } from '../services/sessionMemento.service';
import { Auth0AdapterService } from '../services/authentication/auth0Adapter.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private auth0: Auth0AdapterService,
    private session: SessionMementoService) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const isLoggedIn = this.session.isAuthenticatedAdminSession();
    if (!isLoggedIn) {
      sessionStorage.setItem('nextUrl', state.url);
      this.auth0.adminLogin();
    }
    return isLoggedIn;
  }
}
