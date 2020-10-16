import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { CookiesManagementService } from '../services/cookiesManagement.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class CookiesConsentGuard implements CanActivate {
  constructor(private cookiesManagementService: CookiesManagementService) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.cookiesManagementService.checkCookiesConsent();
    return of(true);
  }
}
