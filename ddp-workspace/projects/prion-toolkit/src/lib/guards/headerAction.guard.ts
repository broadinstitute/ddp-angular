import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CommunicationService } from '../services/communication.service';

@Injectable()
/**
 * Enable accessing operation in header component using routable URLs
 * @howToUse when specifying route definitions, include HeaderActionGuard in the canActivate: list of guards
 * and include either openJoinDialog or openSidePanel boolean properties in data
 * e.g.,
 * {route: '/open-panel', component: ComponentWithHeaderLoaded, canActivate: [HeaderActionGuard], data: {openJoinDialog: true}}
 *
 * Note: this will only work if the header component is currently loaded, otherwise, you will be stuck in current page
 */
export class HeaderActionGuard implements CanActivate {
    constructor(private commService: CommunicationService) { }

    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (next.data.openJoinDialog) {
            this.commService.openJoinDialog();
        } else if (next.data.openSidePanel) {
            this.commService.openSidePanel();
        }
        return of(false);
    }
}
