import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { PrivacyPolicyModalComponent } from '../../privacy-policy/privacyPolicyModal.component';
import { PrivacyModalData } from '../../../models/privacyModalData';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
  selector: 'ddp-privacy-policy-button',
  template: `
    <button (click)="openPolicy()"
            [innerText]="'SDK.CookiesBanner.Policy' | translate"
            [class]="this.className"></button>`
})
export class PrivacyPolicyButtonComponent {
  @Input() className: string;

  constructor(public dialog: MatDialog,
              @Inject('ddp.config') private configuration: ConfigurationService) {
  }

  openPolicy(): void {
    this.dialog.open(PrivacyPolicyModalComponent, {
      width: '740px',
      data: new PrivacyModalData(this.configuration.usePrionPrivacyPolicyTemplate),
      autoFocus: false,
      disableClose: false,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
