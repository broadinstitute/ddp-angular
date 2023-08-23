import { Component, Input } from '@angular/core';
import { SessionMementoService } from 'ddp-sdk';
import { AppRoutes } from '../app-routes';
import { ThemePalette } from '@angular/material/core';

@Component({
    selector: 'app-auth',
    template: `
        <div class="auth__login">
            <ddp-sign-in-out></ddp-sign-in-out>
        </div>
        <a mat-flat-button
           class="action-button btn-auth button button_medium"
           [class.dashboard-button]="isAuthenticated"
           [routerLink]="isAuthenticated ? AppRoutes.Dashboard : AppRoutes.CountMeIn"
           queryParamsHandling="merge"
           [color]="joinButtonColor">
            <ng-container *ngIf="isAuthenticated; else join">
                <mat-icon>perm_identity</mat-icon>
                <span translate>App.Navigation.Dashboard</span>
            </ng-container>
            <ng-template #join><span translate>App.Navigation.Join</span></ng-template>
        </a>`,
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
    @Input() isColorectalTheme = false;
    @Input() isPediHCCTheme = false;
    @Input() isInFooter = false;

    readonly AppRoutes = AppRoutes;

    constructor(private session: SessionMementoService) { }

    public get isAuthenticated(): boolean {
        return this.session.isAuthenticatedSession();
    }

    public get joinButtonColor(): ThemePalette {
        let color = 'primary';

        if (this.isColorectalTheme)
            {color = 'colorectal';}
        if(this.isPediHCCTheme)
            {color = 'pedihcc';}
        if(this.isPediHCCTheme && this.isInFooter)
            {color = 'secondary';}

        return color as ThemePalette;
    }
}
