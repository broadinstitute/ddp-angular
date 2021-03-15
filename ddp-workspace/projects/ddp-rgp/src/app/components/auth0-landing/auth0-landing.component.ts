import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent,
  GovernedParticipantsServiceAgent,
  LoggingService,
} from 'ddp-sdk';

import {
  WorkflowBuilderService,
  ToolkitConfigurationService,
  LoginLandingComponent,
} from 'toolkit';

import { Routes } from '../../routes';

@Component({
  selector: 'app-auth0-landing',
  templateUrl: './auth0-landing.component.html',
  styleUrls: ['./auth0-landing.component.scss'],
})
export class Auth0LandingComponent extends LoginLandingComponent {
  private _auth0: Auth0AdapterService;
  private _config: ConfigurationService;

  constructor(
    router: Router,
    logger: LoggingService,
    auth0: Auth0AdapterService,
    sessionService: SessionMementoService,
    participantService: GovernedParticipantsServiceAgent,
    workflowService: WorkflowServiceAgent,
    workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') config: ConfigurationService,
    @Inject('toolkit.toolkitConfig')
    toolkitConfiguration: ToolkitConfigurationService,
  ) {
    super(
      router,
      logger,
      auth0,
      sessionService,
      participantService,
      workflowService,
      workflowBuilder,
      config,
      toolkitConfiguration,
    );

    this._auth0 = auth0;
    this._config = config;
  }

  protected handleAuthError(err: any | null): void {
    if (!err) {
      return;
    }

    let returnTo: string;

    if (err.statusCode === 401) {
      // We assume that 401 is received when user's email is not verified
      returnTo = Routes.EmailVerificationRequired;
    } else {
      returnTo = Routes.Error;
    }

    this._auth0.webAuth.logout({
      returnTo: `${this._config.baseUrl}${
        this._config.baseUrl.endsWith('/') ? '' : '/'
      }${returnTo}`,
      clientID: this._config.auth0ClientId,
    });
  }
}
