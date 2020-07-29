import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ddp-privacy-policy-modal',
  template: `
    <div class="cookiesModal cookiesModal__header">
      <img class="cookiesModal__logo" lazy-resource src="/assets/images/project-logo-dark.svg"
           [attr.alt]="'SDK.Common.LogoAlt' | translate">
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <ddp-privacy-policy-static></ddp-privacy-policy-static>
  `,
})
export class PrivacyPolicyModalComponent {
  public displayedColumns: string[] = ['name', 'description', 'expiration'];

  constructor(public dialogRef: MatDialogRef<PrivacyPolicyModalComponent>) {
  }

  close(): void {
    this.dialogRef.close();
  }
}
