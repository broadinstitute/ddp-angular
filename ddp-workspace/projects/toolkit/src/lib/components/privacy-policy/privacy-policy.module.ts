import { NgModule } from '@angular/core';
import { PrionPrivacyPolicyComponent } from './prionPrivacyPolicy.component';
import { ActivityModule } from '../activity/activity.module';
import { CookiesPreferencesModalModule } from '../cookies/cookiesPreferencesModal/cookies-preferences-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyModalComponent } from './privacyPolicyModal.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { LazyLoadModule } from '../../../../../ddp-sdk/src/lib/directives/lazy-load/lazy-load.module';

@NgModule({
  imports: [
    TranslateModule,
    ActivityModule,
    CookiesPreferencesModalModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    LazyLoadModule,
  ],
  declarations: [
    PrionPrivacyPolicyComponent,
    PrivacyPolicyModalComponent,
  ],
  exports: [
    PrionPrivacyPolicyComponent,
    // PrivacyPolicyModalComponent,
  ]
})
export class PrivacyPolicyModule {}
