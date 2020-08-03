import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ddp-privacy-policy-modal',
  template: `
    <div class="cookiesModal cookiesModal--header">
      <img class="cookiesModal--logo" lazy-resource
           [src]="this.data"
           [attr.alt]="'SDK.Common.LogoAlt' | translate">
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <ddp-privacy-policy-static></ddp-privacy-policy-static>
  `,
})
export class PrivacyPolicyModalComponent {
  public displayedColumns: string[] = ['name', 'description', 'expiration'];

  constructor(public dialogRef: MatDialogRef<PrivacyPolicyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  close(): void {
    this.dialogRef.close();
  }
}
