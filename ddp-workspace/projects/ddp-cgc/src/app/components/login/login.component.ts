import { Component, EventEmitter, Output } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { Route } from '../../constants/route';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() isAuth: EventEmitter<boolean> = new EventEmitter<boolean>();
  readonly routes = Route;

  constructor(
    private sessionService: SessionMementoService,
  ) {}

  get isAuthenticated(): boolean {
    this.isAuth.emit(this.sessionService.isAuthenticatedSession());
    return this.sessionService.isAuthenticatedSession();
  }
}
