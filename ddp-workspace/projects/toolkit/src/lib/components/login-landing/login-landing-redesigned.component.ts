import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovernedParticipantsServiceAgent } from 'ddp-sdk';

import { LoginLandingComponent } from './login-landing.component';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent
} from 'ddp-sdk';

@Component({
  selector: 'toolkit-login-landing-redesigned',
  template: `
      <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `
})
export class LoginLandingRedesignedComponent extends LoginLandingComponent {
  constructor(
    router: Router,
    auth0: Auth0AdapterService,
    sessionService: SessionMementoService,
    participantService: GovernedParticipantsServiceAgent,
    workflowService: WorkflowServiceAgent,
    workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
    super(router,
      auth0,
      sessionService,
      participantService,
      workflowService,
      workflowBuilder,
      config,
      toolkitConfiguration);
  }
}
