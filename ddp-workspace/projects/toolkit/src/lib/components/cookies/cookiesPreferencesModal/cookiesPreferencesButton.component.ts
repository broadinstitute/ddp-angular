import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ToolkitConfigurationService } from '../../../services/toolkitConfiguration.service';
import { CookiesPreferencesModalComponent } from './cookiesPreferencesModal.component';

@Component({
  selector: 'toolkit-cookies-preferences-button',
  template: `
    <button (click)="openPreferences()"
            [innerText]="'Toolkit.CookiesBanner.Preferences' | translate"
            [class]="this.className"></button>`
})
export class CookiesPreferencesButtonComponent {
  @Input() className: string;
  @Input() privacyPolicyLink: boolean;

  constructor(public dialog: MatDialog,
              @Inject('toolkit.toolkitConfig') public config: ToolkitConfigurationService) {
  }

  openPreferences(): void {
    this.dialog.open(CookiesPreferencesModalComponent, {
      width: '740px',
      data: { cookies: this.config.cookies, privacyPolicyLink: this.privacyPolicyLink },
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
