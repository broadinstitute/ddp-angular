import { Component } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { Route } from '../../constants/route';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  Route = Route;

  constructor(private sessionService: SessionMementoService) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }
}
