import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'toolkit-disclaimer',
    template: `
    <div class="Modal-title">
        <h1 mat-dialog-title class="Modal-title" translate>Toolkit.Warning.Title</h1>
        <mat-icon (click)="closeDialog()" class="close">clear</mat-icon>
    </div>
    <mat-dialog-content>
        <toolkit-warning-message class="modal-message"></toolkit-warning-message>
    </mat-dialog-content>
    <mat-dialog-actions align="start" class="row NoMargin">
        <button mat-button
                mat-button color="primary"
                class="ButtonFilled Button--rect"
                (click)="closeDialog()"
                [innerHTML]="'Toolkit.Warning.SubmitButton' | translate">
        </button>
    </mat-dialog-actions>
    `
})
export class WarningComponent {
    constructor(
        private dialogRef: MatDialogRef<WarningComponent>) { }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}
