import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SessionMementoService } from '../../services/sessionMemento.service';
import { GovernedParticipantsServiceAgent } from '../../services/serviceAgents/governedParticipantsServiceAgent.service';
import { LoggingService } from '../../services/logging.service';
import { Participant } from '../../models/participant';
import { Subject, Subscription } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

@Component({
    selector: 'ddp-manage-participants',
    template: `
  <h2 mat-dialog-title translate>SDK.ManageParticipants.GovernedParticipants</h2>
  <mat-dialog-content>
    <mat-form-field>
        <input matInput
               placeholder="{{'SDK.ManageParticipants.ParticipantPlaceholder' | translate}}"
               [(ngModel)]="currentParticipant">
    </mat-form-field>
    <button mat-button (click)="add()" [innerHTML]="'SDK.AddButton' | translate"></button>
    <mat-list style="margin-bottom:10px">
        <h3 mat-subheader translate>SDK.ManageParticipants.ParticipantsList</h3>
        <mat-list-item *ngFor="let participant of participants" class="card-1">
            {{ participant.alias }}
        </mat-list-item>
    </mat-list>
  </mat-dialog-content>
  <br/>
  <ddp-loading [loaded]="loaded"></ddp-loading>
  <mat-dialog-actions align="end">
    <button mat-button
            mat-dialog-close
            data-ddp-test="cancelButton"
            [innerHTML]="'SDK.CancelButton' | translate">
    </button>
  </mat-dialog-actions>
  `,
    styles: [
        `.card {
        border-radius: 2px;
        margin: 1rem;
      }`,
        `.card-1 {
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
      }`
    ]
})
export class ManageParticipantsComponent implements OnDestroy {
    public loaded: boolean;
    public canSave = false;
    public currentParticipant = '';
    public participants: Array<Participant>;
    private reloadingSubject: Subject<void>;
    private anchor: Subscription;

    constructor(
        private serviceAgent: GovernedParticipantsServiceAgent,
        private logger: LoggingService,
        private session: SessionMementoService,
        public dialogRef: MatDialogRef<ManageParticipantsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.reloadingSubject = new Subject<void>();
        this.anchor = this.reloadingSubject.pipe(
            tap(x => this.logger.logEvent('ManageParticipantsComponent', 'data loading...')),
            mergeMap(x => this.serviceAgent.getList(), (x, y) => y),
            tap(x => this.logger.logEvent('ManageParticipantsComponent', `data loaded: ${JSON.stringify(x)}`)))
            .subscribe(x => {
                this.participants = x;
                this.loaded = true;
            });
        this.reloadingSubject.next();
    }

    public ngOnDestroy(): void {
        this.anchor.unsubscribe();
    }

    public add(): void {
        this.serviceAgent.add(this.currentParticipant).pipe(
            tap(x => this.logger.logEvent('ManageParticipantsComponent', 'Participant added'))
        ).subscribe(() => this.reloadingSubject.next());
        this.currentParticipant = '';
        this.canSave = true;
    }
}
