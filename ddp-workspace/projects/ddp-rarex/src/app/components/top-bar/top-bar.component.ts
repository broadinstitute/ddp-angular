import { Component, OnInit } from '@angular/core';

import { SessionMementoService, UserProfileServiceAgent } from 'ddp-sdk';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { RoutePaths } from '../../router-resources';
import { GovernedUserService } from '../../services/governed-user.service';

interface Profile {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  profile: Profile | null = null;
  readonly routes = RoutePaths;

  constructor(
    private sessionService: SessionMementoService,
    private userProfileService: UserProfileServiceAgent,
    private governedUserService: GovernedUserService,
  ) {}

  ngOnInit(): void {
    this.checkUser();
  }

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

  private checkUser(): void {
    this.sessionService.sessionObservable
      .pipe(
        filter(session => session !== null),
        filter(
          () =>
            this.sessionService.isAuthenticatedSession() &&
            !this.sessionService.session.participantGuid,
        ),
        switchMap(() => this.userProfileService.profile),
        map(profile => ({
          firstName: profile.profile.firstName,
          lastName: profile.profile.lastName,
        })),
        filter(profile => !!profile.firstName && !!profile.lastName),
        take(1),
      )
      .subscribe(profile => {
        this.profile = profile;
      });
  }
}
