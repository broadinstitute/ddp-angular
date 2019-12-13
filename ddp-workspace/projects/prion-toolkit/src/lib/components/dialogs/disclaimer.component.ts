import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToolkitConfigurationService } from './../../services/toolkitConfiguration.service';
import { WindowRef } from 'ddp-sdk';

@Component({
    selector: 'toolkit-disclaimer',
    template: `
    <div class="Modal-title">
        <h1 mat-dialog-title class="Modal-title" translate>Toolkit.Dialogs.Disclaimer.Title</h1>
        <mat-icon (click)="closeDialog()" class="close">clear</mat-icon>
    </div>
    <mat-dialog-content>
        <p class="Modal-text" translate>Toolkit.Dialogs.Disclaimer.Text</p>
    </mat-dialog-content>
    <mat-dialog-actions align="start" class="row NoMargin">
        <button mat-button
                mat-button color="primary"
                class="ButtonFilled Button--rect"
                (click)="submitDialog()"
                [innerHTML]="'Toolkit.Dialogs.Disclaimer.SubmitButton' | translate">
        </button>
    </mat-dialog-actions>
    `
})
export class DisclaimerComponent implements OnInit {
    private cBioPortalLink: string;

    constructor(
        private dialogRef: MatDialogRef<DisclaimerComponent>,
        private windowRef: WindowRef,
        @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

    public ngOnInit(): void {
        this.cBioPortalLink = this.toolkitConfiguration.cBioPortalLink;
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }

    public submitDialog(): void {
        this.closeDialog();
        this.windowRef.nativeWindow.open(this.cBioPortalLink, '_blank');
    }
}
