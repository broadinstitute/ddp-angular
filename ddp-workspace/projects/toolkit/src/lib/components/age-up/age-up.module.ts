import { NgModule } from '@angular/core';
import { AcceptAgeUpPageComponent } from './acceptAgeUpPage.component';
import { VerifyAgeUpPageComponent } from './verifyAgeUpPage.component';
import { DdpAcceptAgeUpModule } from '../../../../../ddp-sdk/src/lib/components/age-up/accept-age-up/accept-age-up.module';
import { DdpVerifyAgeUpModule } from '../../../../../ddp-sdk/src/lib/components/age-up/verify-age-up/verify-age-up.module';

@NgModule({
  imports: [
    DdpAcceptAgeUpModule,
    DdpVerifyAgeUpModule,
  ],
  declarations: [
    AcceptAgeUpPageComponent,
    VerifyAgeUpPageComponent
  ],
  exports: [
    AcceptAgeUpPageComponent,
    VerifyAgeUpPageComponent
  ]
})
export class AgeUpModule {}
