import { Component } from '@angular/core';
import { Route } from '../../../constants/route';
import { Auth0AdapterService } from 'ddp-sdk';


@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.component.html',
  styleUrls: ['./session-expired.component.scss'],
})
export class SessionExpiredComponent {
  Route = Route;

  constructor(
    private readonly auth0: Auth0AdapterService
  ) {}

  signIn(): void {
    this.auth0.login();
  }
}
