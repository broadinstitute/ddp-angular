import { NgModule } from '@angular/core';
import { RedirectToLoginLandingComponent } from './redirect-to-login-landing.component';
import { CommonModule } from '@angular/common';
import { CommonLandingModule } from '../common-landing/common-landing.module';
import { ErrorModule } from '../error/error.module';
import { RedirectToLoginLandingRedesignedComponent } from './redirect-to-login-landing-redesigned.component';
import { DdpLoginModule } from '../../../../../ddp-sdk/src/lib/components/login/login.module';

@NgModule({
  imports: [
    CommonModule,
    CommonLandingModule,
    ErrorModule,
    DdpLoginModule,
  ],
  declarations: [
    RedirectToLoginLandingComponent,
    RedirectToLoginLandingRedesignedComponent,
  ],
  exports: [
    RedirectToLoginLandingComponent,
    RedirectToLoginLandingRedesignedComponent,
  ]
})
export class RedirectToLoginLandingModule {}
