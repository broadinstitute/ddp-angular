import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent,
  GovernedParticipantsServiceAgent
} from 'ddp-sdk';

import {
  WorkflowBuilderService,
  ToolkitConfigurationService,
  LoginLandingComponent
} from 'toolkit';

@Component({
  selector: 'app-auth0-landing',
  templateUrl: './auth0-landing.component.html',
  styleUrls: ['./auth0-landing.component.scss']
})
export class Auth0LandingComponent extends LoginLandingComponent {
  constructor(
    router: Router,
    auth0: Auth0AdapterService,
    sessionService: SessionMementoService,
    participantService: GovernedParticipantsServiceAgent,
    workflowService: WorkflowServiceAgent,
    workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
    super(router, auth0, sessionService, participantService, workflowService, workflowBuilder, config, toolkitConfiguration)
  }
}
