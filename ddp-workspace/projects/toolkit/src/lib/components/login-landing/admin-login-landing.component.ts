import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService
} from 'ddp-sdk';

@Component({
  selector: 'toolkit-admin-login-landing',
  template: `
      <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `
})
export class AdminLoginLandingComponent implements OnInit, OnDestroy {
  private anchor: Subscription;

  constructor(
    private router: Router,
    private auth0: Auth0AdapterService,
    private sessionService: SessionMementoService,
    @Inject('ddp.config') private config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    if (!this.config.doLocalRegistration && location.hash) {
      this.auth0.handleAdminAuthentication(this.handleAuthError.bind(this));
    } else if (!this.config.doLocalRegistration && !location.hash) {
      this.redirect();
    }

    // Subscribe to session observable, so once auth session is set, then we redirect.
    this.anchor = this.sessionService.sessionObservable.pipe(
      filter(session => session !== null && !!session.idToken),
      take(1)
    ).subscribe(() => {
      this.redirect();
    });
  }

  public ngOnDestroy(): void {
    // Subscription might not have been initialized if we encountered auth error and get unloaded.
    this.anchor && this.anchor.unsubscribe();
  }

  private handleAuthError(error: any | null): void {
    if (error) {
      console.error(error);
    }
    this.router.navigateByUrl(this.toolkitConfiguration.errorUrl);
  }

  private redirect(): void {
    const nextUrlFromStorage = sessionStorage.getItem('nextUrl');
    if (nextUrlFromStorage) {
      // `nextUrl` is set before redirecting to auth0. If it exists, then pick up where we left off.
      sessionStorage.removeItem('nextUrl');
      this.router.navigateByUrl(nextUrlFromStorage);
    } else {
      // No `nextUrl` set before going to auth0, go to admin dashboard next.
      this.router.navigateByUrl(this.toolkitConfiguration.adminDashboardUrl);
    }
  }
}
