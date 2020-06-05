import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'toolkit-server-message',
    template: `
      <div class="server-message-popup">
      <div class="server-message-popup-header">
        <mat-icon (click)="closeDialog()" class="close">close</mat-icon>
      </div>
      <mat-dialog-content class="server-message-popup-content">
        <p class="server-message-popup-text">{{text}}</p>
      </mat-dialog-content>
      </div>
    `
})
export class ServerMessageComponent {
  public text: string;
    constructor(
        private dialogRef: MatDialogRef<ServerMessageComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
      this.text = data.text;
    }

    public closeDialog(): void {
        this.dialogRef.close();
    }
}
