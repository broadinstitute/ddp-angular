import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionMementoService, Auth0AdapterService, RenewSessionNotifier } from 'ddp-sdk';
import { interval, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

@Component({
    selector: 'ddp-session-will-expire',
    template: `
    <div class="Modal-title">
        <h1 class="Modal-title no-margin">
            <span>
                <span translate>Toolkit.Dialogs.SessionWillExpire.Title</span>
                <span>{{ timeLeft }}</span>
            </span>
        </h1>
        <button mat-icon-button (click)="closeDialog()" [disabled]="isRenewing">
            <mat-icon class="ddp-close-button">clear</mat-icon>
        </button>
    </div>
    <mat-dialog-content>
        <p class="Modal-text" translate>Toolkit.Dialogs.SessionWillExpire.Text</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="row NoMargin">
        <button class="ButtonFilled ButtonFilled--neutral ButtonFilled--neutral--margin Button--rect button button_small button_secondary"
                (click)="signOut()"
                [disabled]="isRenewing"
                [innerHTML]="'Toolkit.Dialogs.SessionWillExpire.SignOut' | translate">
        </button>
        <button class="ButtonFilled Button--rect button button_small button_primary"
                (click)="renewSession()"
                [disabled]="isRenewing"
                [innerHTML]="'Toolkit.Dialogs.SessionWillExpire.Continue' | translate">
        </button>
    </mat-dialog-actions>`
})
export class SessionWillExpireComponent implements OnInit, OnDestroy {
    public timeLeft = '00:00';
    public isRenewing = false;
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
                const totalSeconds = Math.floor(remainingTime / 1000);
                const seconds = totalSeconds % 60;
                const minutes = (totalSeconds - seconds) / 60;
                const formattedMinutes = this.formatTime(minutes);
                const formattedSeconds = this.formatTime(seconds);
                this.timeLeft = `${formattedMinutes}:${formattedSeconds}`;
            } else {
                this.timeLeft = '00:00';
                this.auth0.logout('session-expired');
            }
        });
        this.anchor.add(timer);
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public signOut(): void {
        this.renewNotifier.hideSessionExpirationNotifications();
        this.auth0.logout();
    }

    public renewSession(): void {
        // Blocks UI to prevent interference in the session renewing process
        this.isRenewing = true;
        const participantGuid = this.session.session.participantGuid;
        const session = this.session.sessionObservable.pipe(
            // Because the session is BehaviorSubject, we should skip a current session,
            // we are only interested in the renewed session
            skip(1)
        ).subscribe((session) => {
            // If participantGuid is in place or we didn't have participantGuid at all, return to the app
            if ((participantGuid && session.participantGuid) || !participantGuid) {
                this.renewNotifier.hideSessionExpirationNotifications();
                // If we had participantGuid, but new session lost it, restore it
            } else if (participantGuid && !session.participantGuid) {
                this.session.setParticipant(participantGuid);
            }
        });
        this.anchor.add(session);
        this.auth0.auth0RenewToken();
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }

    private formatTime(value: number): string {
        return value < 10 ? `0${value}` : `${value}`;
    }
}
