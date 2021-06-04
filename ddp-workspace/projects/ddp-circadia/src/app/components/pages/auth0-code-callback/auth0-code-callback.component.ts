import { Component } from '@angular/core';

import { Auth0CodeCallbackComponent as SDKAuth0CodeCallbackComponent } from 'ddp-sdk';

@Component({
  selector: 'app-auth0-code-callback',
  templateUrl: './auth0-code-callback.component.html',
  styleUrls: ['./auth0-code-callback.component.scss'],
})
export class Auth0CodeCallbackComponent extends SDKAuth0CodeCallbackComponent {}
