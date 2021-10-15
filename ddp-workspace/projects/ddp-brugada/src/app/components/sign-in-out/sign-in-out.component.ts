import { Component } from '@angular/core';

import { SignInOutComponent as DDPSignInOutComponent } from 'ddp-sdk';

import { Route } from '../../constants/Route';

@Component({
  selector: 'app-sign-in-out',
  templateUrl: './sign-in-out.component.html',
  styleUrls: ['./sign-in-out.component.scss'],
})
export class SignInOutComponent extends DDPSignInOutComponent {
  Route = Route;
}
