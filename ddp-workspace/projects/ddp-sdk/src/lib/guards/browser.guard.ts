import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { BrowserContentService } from '../services/browserContent.service';
import { Observable } from 'rxjs';

@Injectable()
export class BrowserGuard implements CanActivate {
    constructor(
        private router: Router,
        private browserContent: BrowserContentService) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.browserContent.unsupportedBrowser()) {
            this.router.navigateByUrl('/');
            return false;
        }
        return true;
    }
}
