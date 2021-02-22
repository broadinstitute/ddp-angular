import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  LoggingService
} from 'ddp-sdk';

@Component({
  selector: 'toolkit-admin-login-landing',
  template: `
      <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `
})
export class AdminLoginLandingComponent implements OnInit, OnDestroy {
  private anchor: Subscription;
  private readonly LOG_SOURCE = 'AdminLoginLandingComponent';

  constructor(
    private router: Router,
    private logger: LoggingService,
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

    // Subscribe to session observable, so once admin session is set, then we redirect.
    this.anchor = this.sessionService.sessionObservable.pipe(
      filter(session => session !== null && !!session.idToken && session.isAdmin),
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
    // No need to decode error, and it should have already been logged.

    // Logout to clear any potentially leftover state. Otherwise, user might be stuck in error mode
    // and cannot re-attempt login until browser cache is cleared manually.
    this.auth0.logout(this.toolkitConfiguration.errorUrl);
  }

  private redirect(): void {
    const nextUrlFromStorage = sessionStorage.getItem('adminNextUrl');
    if (nextUrlFromStorage) {
      // `adminNextUrl` is set before redirecting to auth0. If it exists, then pick up where we left off.
      sessionStorage.removeItem('adminNextUrl');
      this.router.navigateByUrl(nextUrlFromStorage);
    } else {
      // No `adminNextUrl` set before going to auth0, go to admin dashboard next.
      this.router.navigateByUrl(this.toolkitConfiguration.adminDashboardUrl);
    }
  }
}
