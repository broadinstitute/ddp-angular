import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs/operators';

import {
  CompositeDisposable,
  SessionMementoService,
  UserProfileServiceAgent,
} from 'ddp-sdk';

import { RoutePaths } from '../../router-resources';
import { GovernedUserService } from '../../services/governed-user.service';
import { ParticipantService } from '../../services/participant.service';
import { Observable } from 'rxjs';

interface Profile {
  firstName: string;
  lastName: string;
}

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  profile: Profile | null = null;
  isParticipantNameShown = false;
  readonly routes = RoutePaths;

  private subs = new CompositeDisposable();

  constructor(
    private router: Router,
    private sessionService: SessionMementoService,
    private userProfileService: UserProfileServiceAgent,
    private governedUserService: GovernedUserService,
    private participantService: ParticipantService,
  ) {}

  ngOnInit(): void {
    this.checkUser();
    this.initRouteListener();
  }

  ngOnDestroy(): void {
    this.subs.removeAll();
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

  get participantName(): Observable<string> {
    return this.participantService.participantProfile$.pipe(
      map(profile => {
        if (!profile || !profile.firstName || !profile.lastName) {
          return '';
        }

        return `${profile.firstName} ${profile.lastName}`;
      }),
    );
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

  private initRouteListener(): void {
    const routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isParticipantNameShown = e.url === `/${RoutePaths.Survey}`;
      });

    this.subs.addNew(routeSub);
  }
}
