import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, mergeMap, take } from 'rxjs/operators';

import {
  Auth0AdapterService,
  ConfigurationService,
  LoggingService,
  SessionMementoService,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { RoutePaths } from '../../router-resources';
import { WorkflowBuilderService } from 'toolkit';

@Component({
  selector: 'app-login-landing',
  templateUrl: './login-landing.component.html',
  styleUrls: ['./login-landing.component.scss'],
})
export class LoginLandingComponent implements OnInit {
  private readonly LOG_SOURCE = 'LoginLandingComponent';

  constructor(
    private router: Router,
    private auth0Service: Auth0AdapterService,
    private loggingService: LoggingService,
    private sessionService: SessionMementoService,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilderService: WorkflowBuilderService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    if (!this.config.doLocalRegistration && window.location.hash) {
      this.handleAuth();
    }

    this.redirect();
  }

  private handleAuth(): void {
    this.auth0Service.handleAuthentication(this.handleAuthError.bind(this));
  }

  private handleAuthError(error: any): void {
    if (error) {
      this.loggingService.logError(
        `${this.LOG_SOURCE}::handleAuthError`,
        error,
      );
    }

    this.router.navigateByUrl(RoutePaths.Error, {
        state: { errorMessage: error?.message }
    });
  }

  private redirect(): void {
    this.sessionService.sessionObservable
      .pipe(
        filter(session => session && !!session.idToken),
        mergeMap(() => this.workflowService.getNext()),
        take(1),
      )
      .subscribe(workflowResponse => {
        this.workflowBuilderService.getCommand(workflowResponse).execute();
      });
  }
}
