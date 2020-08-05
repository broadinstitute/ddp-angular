import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { PrivacyPolicyModalComponent } from '../privacyPolicy/privacyPolicyModal.component';

@Component({
  selector: 'ddp-privacy-policy-button',
  template: `
    <button (click)="openPolicy()"
            [innerText]="'SDK.CookiesBanner.Policy' | translate"
            [class]="this.className"></button>`
})
export class PrivacyPolicyButtonComponent {
  @Input() className: string;
  @Input() logoSrc: string;

  constructor(public dialog: MatDialog) {
  }

  openPolicy(): void {
    this.dialog.open(PrivacyPolicyModalComponent, {
      width: '740px',
      data: this.logoSrc,
      autoFocus: false,
      disableClose: false,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
