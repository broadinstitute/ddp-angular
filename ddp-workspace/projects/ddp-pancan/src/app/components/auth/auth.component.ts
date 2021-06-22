import { Component } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';

@Component({
    selector: 'app-auth',
    template: `
        <ddp-language-selector></ddp-language-selector>
        <div class="auth__login">
            <ddp-sign-in-out></ddp-sign-in-out>
        </div>
        <a *ngIf="!isAuthenticated"
           mat-flat-button
           class="join-button btn-common"
           routerLink="count-me-in"
           color="primary">
            <span translate>App.Navigation.Join</span>
        </a>`,
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    constructor(private session: SessionMementoService) { }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }
}
