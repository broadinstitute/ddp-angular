import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent,
  LoggingService,
} from 'ddp-sdk';

import { WorkflowBuilderService, ToolkitConfigurationService } from 'toolkit';

import { Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import * as Routes from '../../router-resources';

@Component({
  selector: 'app-atcp-login-landing',
  template: ` <toolkit-common-landing></toolkit-common-landing> `,
})
export class AtcpLoginLandingComponent implements OnInit, OnDestroy {
  private anchor: Subscription;
  private LOG_SOURCE = 'AtcpLoginLandingComponent';
  constructor(
    private router: Router,
    private auth0: Auth0AdapterService,
    private sessionService: SessionMementoService,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilder: WorkflowBuilderService,
    private log: LoggingService,
    @Inject('ddp.config') private config: ConfigurationService,
    @Inject('toolkit.toolkitConfig')
    private toolkitConfiguration: ToolkitConfigurationService
  ) {}

  public ngOnInit(): void {
    if (!this.config.doLocalRegistration && location.hash) {
      // if we're doing local registration, session has already been set
      // and logging out and parsing hash will fail
      this.auth0.handleAuthentication(this.handleAuthError.bind(this));
    } else if (!this.config.doLocalRegistration && !location.hash) {
      this.redirect();
    }

    // Subscribe to session observable, so once auth session is set, then we redirect.
    this.anchor = this.sessionService.sessionObservable
      .pipe(
        filter(session => session !== null && !!session.idToken),
        take(1)
      )
      .subscribe(() => {
        this.redirect();
      });
  }

  public ngOnDestroy(): void {
    // Subscription might not have been initialized if we encountered auth error and get unloaded.
    this.anchor && this.anchor.unsubscribe();
  }

  private handleAuthError(error: any | null): void {
    if (error) {
      this.log.logEvent(
        this.LOG_SOURCE,
        'auth error occured: ' + JSON.stringify(error)
      );
      if (error.code === 'unauthorized') {
        this.auth0.logout(Routes.AccountActivationRequired);
        return;
      }
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
      // No `nextUrl` set before going to auth0, query the workflow service to get where to go next.
      this.workflowService
        .getNext()
        .pipe(take(1))
        .subscribe(
          response =>
            response && this.workflowBuilder.getCommand(response).execute()
        );
    }
  }
}
