import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { PrivacyPolicyModalComponent } from '../privacyPolicyModal.component';
import { PrivacyModalData } from '../../../models/privacyModalData';
import { ToolkitConfigurationService } from '../../../services/toolkitConfiguration.service';

@Component({
  selector: 'toolkit-privacy-policy-button',
  template: `
    <button (click)="openPolicy()"
            [innerText]="'Toolkit.CookiesBanner.Policy' | translate"
            [class]="this.className"></button>`
})
export class PrivacyPolicyButtonComponent {
  @Input() className: string;

  constructor(public dialog: MatDialog,
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
  }

  openPolicy(): void {
    this.dialog.open(PrivacyPolicyModalComponent, {
      width: '800px',
      data: new PrivacyModalData(this.config.usePrionPrivacyPolicyTemplate),
      autoFocus: false,
      disableClose: false,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
