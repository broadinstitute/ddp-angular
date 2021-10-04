import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs/operators';

import {
  Auth0AdapterService,
  ConfigurationService,
  LoggingService,
  SessionMementoService,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { WorkflowBuilderService } from 'toolkit';

import { Route } from '../../constants/Route';

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
    private workflowService: WorkflowServiceAgent,
    private workflowBuilderService: WorkflowBuilderService,
    private sessionService: SessionMementoService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    if (!this.config.doLocalRegistration) {
      if (location.hash) {
        this.auth0Service.handleAuthentication(e => this.handleAuthError(e));
      } else {
        this.redirect();
      }
    }

    this.sessionService.sessionObservable
      .pipe(
        filter(session => session !== null && !!session.idToken),
        take(1),
      )
      .subscribe(() => {
        this.redirect();
      });
  }

  private handleAuthError(err: any): void {
    if (err) {
      this.loggingService.logError(this.LOG_SOURCE, err);
    }

    this.router.navigateByUrl(Route.Error);
  }

  private redirect(): void {
    const nextUrl = sessionStorage.getItem('nextUrl');

    if (nextUrl) {
      sessionStorage.removeItem('nextUrl');

      this.router.navigateByUrl(nextUrl);
    } else {
      this.workflowService
        .getNext()
        .pipe(take(1))
        .subscribe(response => response && this.workflowBuilderService.getCommand(response).execute());
    }
  }
}
