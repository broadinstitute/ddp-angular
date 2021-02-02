import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

import {Auth0CodeCallbackComponent} from './auth0-code-callback.component';
import {LoginComponent} from './login.component';
import {RedirectToAuth0LoginComponent} from './redirectToAuth0Login.component';
import {SignInOutComponent} from './signInOut.component';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  declarations: [
    Auth0CodeCallbackComponent,
    LoginComponent,
    RedirectToAuth0LoginComponent,
    SignInOutComponent,
  ],
  exports: [
    Auth0CodeCallbackComponent,
    LoginComponent,
    RedirectToAuth0LoginComponent,
    SignInOutComponent,
  ],
})
export class DdpLoginModule { }
