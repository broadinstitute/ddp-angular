import { Component } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { RoutePaths } from '../../router-resources';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {
  readonly routes = RoutePaths;
  readonly rarexLink = 'https://rare-x.org/';

  constructor(private readonly _session: SessionMementoService) {}

  get isAuthenticated(): boolean {
    return this._session.isAuthenticatedSession();
  }
}
