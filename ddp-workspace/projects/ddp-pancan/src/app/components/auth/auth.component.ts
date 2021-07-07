import { Component } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-auth',
    template: `
        <div class="auth__login">
            <ddp-sign-in-out></ddp-sign-in-out>
        </div>
        <a *ngIf="!isAuthenticated"
           mat-flat-button
           class="join-button btn-common"
           [routerLink]="AppRoutes.CountMeIn"
           color="primary">
            <span translate>App.Navigation.Join</span>
        </a>`,
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    readonly AppRoutes = AppRoutes;
    constructor(private session: SessionMementoService) { }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }
}
