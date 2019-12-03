import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';

@Component({
    selector: 'ddp-user-menu',
    template: `
    <ng-container *ngIf="isAuthenticated; then menu else button">
    </ng-container>

    <ng-template #menu>
        <button mat-icon-button
                [matMenuTriggerFor]="userMenu">
            <mat-icon class="ddp-user"
                      [ngClass]="{'ddp-user--scrolled': isScrolled}">
                person
            </mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
            <button mat-menu-item
                    (click)="openDashboard()"
                    class="ddp-user-menu-button">
                <span class="ddp-menu-text" translate>SDK.UserMenu.DashboardButton</span>
            </button>
            <button mat-menu-item
                    (click)="logout()"
                    class="ddp-user-menu-button">
                <span class="ddp-menu-text" translate>SDK.UserMenu.SignOutButton</span>
            </button>
        </mat-menu>
    </ng-template>

    <ng-template #button>
        <ddp-sign-in-out [isScrolled]="isScrolled"></ddp-sign-in-out>
    </ng-template>`
})
export class UserMenuComponent {
    @Input() isScrolled: boolean;

    constructor(
        private router: Router,
        private session: SessionMementoService,
        private auth0: Auth0AdapterService) { }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }

    public openDashboard(): void {
        this.router.navigateByUrl('dashboard');
    }

    public logout(): void {
        this.auth0.logout();
    }
}
