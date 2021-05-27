import { Component } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { Route } from '../../constants/route';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly routes = Route;

  constructor(
    private sessionService: SessionMementoService,
  ) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }
}
