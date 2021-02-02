import { NgModule } from '@angular/core';
import { PrivacyPolicyButtonComponent } from './privacyPolicyButton.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [TranslateModule],
  declarations: [PrivacyPolicyButtonComponent],
  exports: [PrivacyPolicyButtonComponent]
})
export class PrivacyPolicyButtonModule {}
