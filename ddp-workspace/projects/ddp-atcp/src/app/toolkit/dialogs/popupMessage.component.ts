import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-popup-message',
    template: `
      <div class="popup-message">
        <div class="popup-message-header">
          <mat-icon (click)="closeDialog()" class="close">close</mat-icon>
        </div>
        <mat-dialog-content class="popup-message-content">
          <p class="popup-message-text">{{text}}</p>
        </mat-dialog-content>
      </div>
    `
})
export class PopupMessageComponent {
  public text: string;
    constructor(
        private dialogRef: MatDialogRef<PopupMessageComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
      this.text = data.text;
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}
