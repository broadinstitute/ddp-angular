import { Component, Inject, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { ConfigurationService } from '../../../services/configuration.service';
import { CookiesPreferencesModalComponent } from '../cookiesPreferencesModal/cookiesPreferencesModal.component';

@Component({
  selector: 'ddp-cookies-preferences-button',
  template: `
    <button (click)="openPreferences()"
            [innerText]="this.text"
            [class]="this.className"></button>`
})
export class CookiesPreferencesButtonComponent {
  @Input() logoSrc: string;
  @Input() text: string;
  @Input() className: string;

  constructor(public dialog: MatDialog,
              @Inject('ddp.config') private configuration: ConfigurationService) {
  }

  openPreferences(): void {
    this.dialog.open(CookiesPreferencesModalComponent, {
      width: '740px',
      data: { cookies: this.configuration.cookies, logo: this.logoSrc },
      autoFocus: false,
      disableClose: true,
      scrollStrategy: new NoopScrollStrategy()
    });
  }
}
