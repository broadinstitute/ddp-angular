import { Component } from '@angular/core';

import { SessionMementoService } from 'ddp-sdk';

import { RoutePaths } from '../../router-resources';
import { GovernedUserService } from '../../services/governed-user.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  readonly routes = RoutePaths;

  constructor(
    private sessionService: SessionMementoService,
    private governedUserService: GovernedUserService,
  ) {}

  get isAuthenticated(): boolean {
    return this.sessionService.isAuthenticatedSession();
  }

  get dashboardUrl(): string {
    const isGoverned = this.governedUserService.isGoverned$.getValue();

    if (isGoverned === null) {
      return '';
    }

    return isGoverned ? RoutePaths.ParticipantsList : RoutePaths.Dashboard;
  }
}
