import { NgModule } from '@angular/core';
import { RedirectToAuth0LoginComponent } from './redirect-to-auth0-login.component';
import { RedirectToAuth0LoginRedesignedComponent } from './redirect-to-auth0-login-redesigned.component';
import { CommonLandingModule } from '../common-landing/common-landing.module';

@NgModule({
  imports: [
    CommonLandingModule
  ],
  declarations: [
    RedirectToAuth0LoginComponent,
    RedirectToAuth0LoginRedesignedComponent
  ],
  exports: [
    RedirectToAuth0LoginComponent,
    RedirectToAuth0LoginRedesignedComponent
  ]
})
export class RedirectToAuth0LoginModule {}
