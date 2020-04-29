import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionMementoService, Auth0AdapterService, RenewSessionNotifier } from 'ddp-sdk';
import { interval, Subscription } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Component({
    selector: 'ddp-session-will-expire',
    template: `
    <div class="Modal-title">

        <h1 class="Modal-title no-margin">
            <span *ngIf="!renewalFailed; else renewalFailedMessage">
                <span translate>Toolkit.Dialogs.SessionWillExpire.Title</span>
                <span>{{ timeLeft }}</span>
            </span>
            <ng-template #renewalFailedMessage>
                <span translate>Toolkit.Dialogs.SessionWillExpire.RenewalFailed</span>
            </ng-template>
        </h1>
        <button mat-icon-button (click)="closeDialog()" [disabled]="blockUI">
            <mat-icon class="ddp-close-button">clear</mat-icon>
        </button>
    </div>
    <mat-dialog-content *ngIf="!renewalFailed">
        <p class="Modal-text" translate>Toolkit.Dialogs.SessionWillExpire.Text</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="row NoMargin">
        <button class="ButtonFilled ButtonFilled--neutral ButtonFilled--neutral--margin Button--rect button button_small button_secondary"
                (click)="signOut()"
                [disabled]="blockUI"
                [innerHTML]="'Toolkit.Dialogs.SessionWillExpire.SignOut' | translate">
        </button>
        <button *ngIf="!renewalFailed" class="ButtonFilled Button--rect button button_small button_primary"
                (click)="renewSession()"
                [disabled]="blockUI"
                [innerHTML]="'Toolkit.Dialogs.SessionWillExpire.Continue' | translate">
        </button>
    </mat-dialog-actions>`
})
export class SessionWillExpireComponent implements OnInit, OnDestroy {
    public timeLeft = '00:00';
    // Blocks UI to prevent interference in the session renewing/logout process
    public blockUI = false;
    public renewalFailed = false;
    private anchor: Subscription = new Subscription();

    constructor(
        private session: SessionMementoService,
        private auth0: Auth0AdapterService,
        private renewNotifier: RenewSessionNotifier,
        private dialogRef: MatDialogRef<SessionWillExpireComponent>) { }

    public ngOnInit(): void {
        const EXTRA_TIME = 60000;
        const expiresAt = this.session.expiresAt;
        const timer = interval(1000).subscribe(() => {
            const now = Date.now();
            const remainingTime = expiresAt - now - EXTRA_TIME;
            if (remainingTime > 0) {
                this.timeLeft = this.calculateTimeLeft(remainingTime);
            } else {
                this.timeLeft = '00:00';
                if (!this.blockUI) {
                    this.auth0.handleExpiredAuthenticatedSession();
                }
            }
        });
        this.anchor.add(timer);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public signOut(): void {
        this.blockUI = true;
        this.renewNotifier.hideSessionExpirationNotifications();
        this.auth0.logout();
    }

    public renewSession(): void {
        this.blockUI = true;
        this.auth0.auth0RenewToken().pipe(
            take(1),
            finalize(() => this.blockUI = false)
        ).subscribe(
            () => { },
            err => this.renewalFailed = true
        );
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }

    private calculateTimeLeft(remainingTime: number): string {
        const totalSeconds = Math.floor(remainingTime / 1000);
        const seconds = totalSeconds % 60;
        const minutes = (totalSeconds - seconds) / 60;
        const formattedMinutes = this.formatTime(minutes);
        const formattedSeconds = this.formatTime(seconds);
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    private formatTime(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
