import { NgModule } from '@angular/core';
import { LoginLandingComponent } from './login-landing.component';
import { AdminLoginLandingComponent } from './admin-login-landing.component';
import { LoginLandingRedesignedComponent } from './login-landing-redesigned.component';
import { CommonLandingModule } from '../common-landing/common-landing.module';

@NgModule({
  imports: [
    CommonLandingModule
  ],
  declarations: [
    LoginLandingComponent,
    AdminLoginLandingComponent,
    LoginLandingRedesignedComponent
  ],
  exports: [
    LoginLandingComponent,
    AdminLoginLandingComponent,
    LoginLandingRedesignedComponent
  ]
})
export class LoginLandingModule {}
