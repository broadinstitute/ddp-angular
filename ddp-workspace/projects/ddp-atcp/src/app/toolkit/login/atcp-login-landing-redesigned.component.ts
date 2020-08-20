import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovernedParticipantsServiceAgent,
  LoggingService,
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent
} from 'ddp-sdk';

import { AtcpLoginLandingComponent } from './atcp-login-landing.component';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';

@Component({
  selector: 'app-atcp-login-landing-redesigned',
  template: `
      <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `
})
export class AtcpLoginLandingRedesignedComponent extends AtcpLoginLandingComponent {
  constructor(
    router: Router,
    auth0: Auth0AdapterService,
    sessionService: SessionMementoService,
    participantService: GovernedParticipantsServiceAgent,
    workflowService: WorkflowServiceAgent,
    workflowBuilder: WorkflowBuilderService,
    log: LoggingService,
    @Inject('ddp.config') config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
    super(router,
      auth0,
      sessionService,
      participantService,
      workflowService,
      workflowBuilder,
      log,
      config,
      toolkitConfiguration);
  }
}
