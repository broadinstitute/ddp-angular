import { NgModule } from '@angular/core';
import { CookiesPreferencesButtonComponent } from './cookiesPreferencesButton.component';
import { TranslateModule } from '@ngx-translate/core';
import { CookiesPreferencesModalComponent } from './cookiesPreferencesModal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { PrivacyPolicyButtonModule } from '../../privacy-policy/button/privacy-policy-button.module';
import { LazyLoadModule } from '../../../../../../ddp-sdk/src/lib/directives/lazy-load/lazy-load.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    PrivacyPolicyButtonModule,
    LazyLoadModule,
  ],
  declarations: [
    CookiesPreferencesButtonComponent,
    CookiesPreferencesModalComponent
  ],
  exports: [
    CookiesPreferencesButtonComponent,
    CookiesPreferencesModalComponent
  ]
})
export class CookiesPreferencesModalModule {}
