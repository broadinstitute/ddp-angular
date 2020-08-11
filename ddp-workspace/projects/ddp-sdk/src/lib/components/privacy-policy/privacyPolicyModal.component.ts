import {
  Component,
  Inject
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrivacyModalData } from "../../models/privacyModalData";

@Component({
  selector: 'ddp-privacy-policy-modal',
  template: `
    <div class="cookiesModal cookiesModal__header">
      <img class="cookiesModal__logo" lazy-resource src="/assets/images/project-logo-dark.svg"
           [attr.alt]="'Toolkit.Common.LogoAlt' | translate">
      <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
    </div>
    <div *ngIf="data.usePrionTemplate" class="mat-dialog-content">
      <prion-privacy-policy></prion-privacy-policy>
    </div>
    <div *ngIf="!data.usePrionTemplate">
      <p>Please specify your template here...</p>
    </div>
  `,
})
export class PrivacyPolicyModalComponent {
  constructor(public dialogRef: MatDialogRef<PrivacyPolicyModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PrivacyModalData) {
  }

  close(): void {
    this.dialogRef.close();
  }
}
