import { NgModule } from '@angular/core';
import { CookiesBannerComponent } from './cookiesBanner.component';
import { CookiesPreferencesModalModule } from '../cookiesPreferencesModal/cookies-preferences-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyButtonModule } from '../../privacy-policy/button/privacy-policy-button.module';

@NgModule({
  imports: [
    PrivacyPolicyButtonModule,
    CookiesPreferencesModalModule,
    TranslateModule
  ],
  declarations: [
    CookiesBannerComponent
  ],
  exports: [
    CookiesBannerComponent
  ]
})
export class CookiesBannerModule {}
