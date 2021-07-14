import { Component } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { AppRoutes } from '../app-routes';

@Component({
    selector: 'app-auth',
    template: `
        <div class="auth__login">
            <ddp-sign-in-out></ddp-sign-in-out>
        </div>
        <a mat-flat-button
           class="action-button btn-common"
           [class.dashboard-button]="isAuthenticated"
           [routerLink]="isAuthenticated ? AppRoutes.Dashboard : AppRoutes.CountMeIn"
           color="primary">
            <ng-container *ngIf="isAuthenticated; else join">
                <mat-icon>perm_identity</mat-icon>
                <span translate>App.Navigation.Dashboard</span>
            </ng-container>
            <ng-template #join><span translate>App.Navigation.Join</span></ng-template>
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
