import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserProfileDto } from '../../models/userProfileDto';
import { UserProfileBusService } from '../../services/userProfileBus.service';
import { GovernedParticipantsServiceAgent } from '../../services/serviceAgents/governedParticipantsServiceAgent.service';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { LoggingService } from '../../services/logging.service';
import { UserPreferencesComponent } from './userPreferences.component';
import { ManageParticipantsComponent } from './manageParticipants.component';
import { Participant } from '../../models/participant';
import { Subject, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
    selector: 'ddp-participant-profile',
    template: `
  <button mat-button *ngIf="session.isAuthenticatedSession()"
                     data-ddp-test="profileButton"
                     [matMenuTriggerFor]="menu">
    <mat-icon>person</mat-icon> {{ profile?.name }}
  </button>
  <mat-list></mat-list>
  <mat-menu #menu="matMenu">
    <button mat-menu-item (click)="openPreferences()" [innerHTML]="'SDK.ParticipantProfile.OpenProfile' | translate">
        <mat-icon>person</mat-icon>
    </button>
    <mat-divider></mat-divider>
    <div style="margin: 10px" class="mat-caption" translate>SDK.ParticipantProfile.ViewAs</div>
    <button mat-menu-item *ngFor="let participant of participants" (click)="select(participant.userGuid)">
        <mat-icon *ngIf="isSelected(participant.userGuid); else elseBlock">radio_button_checked</mat-icon>
        <ng-template #elseBlock><mat-icon>radio_button_unchecked</mat-icon></ng-template>
        {{ participant.alias }}
    </button>
    <mat-divider></mat-divider>
    <button mat-menu-item
            (click)="openManageParticipants()"
            [innerHTML]="'SDK.ParticipantProfile.ManageParticipants' | translate">
        <mat-icon>supervisor_account</mat-icon>
    </button>
  </mat-menu>
  `
})
export class ParticipantProfileComponent implements OnDestroy {
    public profile: UserProfileDto | null;
    public participants: Array<Participant>;
    private currentParticipant: string | null;
    private profileSubscription: Subscription;
    private reloadingSubject: Subject<void>;
    private anchor: Subscription;

    constructor(
        private serviceAgent: GovernedParticipantsServiceAgent,
        private logger: LoggingService,
        public userProfile: UserProfileBusService,
        public dialog: MatDialog,
        public session: SessionMementoService) {
        this.profileSubscription =
            userProfile.getProfile().subscribe(info => {
                this.profile = info;
            });
        this.reloadingSubject = new Subject<void>();
        this.anchor = this.reloadingSubject.pipe(
            mergeMap(x => {
                return this.serviceAgent.getList();
            }, (x, y) => y),
            tap(x => this.logger.logEvent('ParticipantProfile', `data loaded: ${JSON.stringify(x)}`))
        ).subscribe(x => this.participants = x);
        this.reloadingSubject.next();
        this.session.sessionObservable
            .subscribe(x => {
                if (x != null) {
                    this.currentParticipant = x.participantGuid;
                } else {
                    this.currentParticipant = null;
                }
            });
    }

    public ngOnDestroy(): void {
        this.profileSubscription.unsubscribe();
        this.anchor.unsubscribe();
    }

    public isSelected(guid: string): boolean {
        return this.currentParticipant === guid;
    }

    public select(guid: string): void {
        this.session.setParticipant(guid);
    }

    public openPreferences(): void {
        const dialogRef = this.dialog.open(UserPreferencesComponent, {
            width: '450px',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => { });
    }

    public openManageParticipants(): void {
        const dialogRef = this.dialog.open(ManageParticipantsComponent, {
            width: '350px',
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => this.reloadingSubject.next());
    }
}
