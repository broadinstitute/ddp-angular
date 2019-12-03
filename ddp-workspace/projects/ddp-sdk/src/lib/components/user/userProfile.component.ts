import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDto } from '../../models/userProfileDto';
import { UserProfileBusService } from '../../services/userProfileBus.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { UserPreferencesComponent } from './userPreferences.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ddp-user-profile',
    template: `
    <button mat-button *ngIf="session.isAuthenticatedSession()"
                        data-ddp-test="profileButton"
                        (click)="openDialog()">
        <mat-icon>person</mat-icon> {{ profile?.name }}
    </button>
    `
})
export class UserProfileComponent implements OnDestroy {
    public profile: UserProfileDto | null;
    private profileSubscription: Subscription;

    constructor(
        private userProfile: UserProfileBusService,
        private dialog: MatDialog,
        public session: SessionMementoService) {
        this.profileSubscription =
            this.userProfile.getProfile().subscribe(info => {
                this.profile = info;
            });
    }

    public ngOnDestroy(): void {
        this.profileSubscription.unsubscribe();
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(UserPreferencesComponent, {
            width: '450px',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => { });
    }
}
