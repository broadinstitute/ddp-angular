import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ConfigurationService } from '../../../services/configuration.service';
import { CookiesManagementService } from '../../../services/cookiesManagement.service';
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

  constructor(private cookiesService: CookiesManagementService,
              public dialog: MatDialog,
              @Inject('ddp.config') private configuration: ConfigurationService) {
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
