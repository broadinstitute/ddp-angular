import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { Auth0AdapterService } from '../../services/authentication/auth0Adapter.service';
import { ConfigurationService } from '../../services/configuration.service';

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
            <button *ngIf="!isAdmin; else prismLink"
                    mat-menu-item
                    (click)="openDashboard()"
                    class="ddp-user-menu-button dashboard-link">
                <span class="ddp-menu-text" translate>SDK.UserMenu.DashboardButton</span>
            </button>
            <ng-template #prismLink>
                <button mat-menu-item
                        (click)="openPrism()"
                        class="ddp-user-menu-button prism-link">
                    <span class="ddp-menu-text" translate>SDK.UserMenu.PrismButton</span>
                </button>
            </ng-template>
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
        private auth0: Auth0AdapterService,
        @Inject('ddp.config') private config: ConfigurationService) { }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }

    public openDashboard(): void {
        this.router.navigateByUrl('dashboard');
    }

    public openPrism(): void {
        this.router.navigateByUrl(this.config.prismRoute);
    }

    public logout(): void {
        this.auth0.logout();
    }

    public get isAdmin(): boolean {
        return this.session.isAuthenticatedAdminSession();
    }
}
