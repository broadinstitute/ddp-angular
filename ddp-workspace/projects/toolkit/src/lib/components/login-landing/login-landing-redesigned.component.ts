import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoginLandingComponent } from './login-landing.component';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

// import {
//   GovernedParticipantsServiceAgent,
//   SessionMementoService,
//   Auth0AdapterService,
//   ConfigurationService,
//   WorkflowServiceAgent,
//   LoggingService
// } from 'ddp-sdk';
import {LoggingService} from "../../../../../ddp-sdk/src/lib/services/logging.service";
import {Auth0AdapterService} from "../../../../../ddp-sdk/src/lib/services/authentication/auth0Adapter.service";
import {SessionMementoService} from "../../../../../ddp-sdk/src/lib/services/sessionMemento.service";
import {GovernedParticipantsServiceAgent} from "../../../../../ddp-sdk/src/lib/services/serviceAgents/governedParticipantsServiceAgent.service";
import {ConfigurationService} from "../../../../../ddp-sdk/src/lib/services/configuration.service";
import {WorkflowServiceAgent} from "../../../../../ddp-sdk/src/lib/services/serviceAgents/workflowServiceAgent.service";

@Component({
  selector: 'toolkit-login-landing-redesigned',
  template: `
      <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `
})
export class LoginLandingRedesignedComponent extends LoginLandingComponent {
  constructor(
    private _router: Router,
    private _logger: LoggingService,
    private _auth0: Auth0AdapterService,
    private _sessionService: SessionMementoService,
    private _participantService: GovernedParticipantsServiceAgent,
    private _workflowService: WorkflowServiceAgent,
    private _workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') private _config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
    super(_router,
      _logger,
      _auth0,
      _sessionService,
      _participantService,
      _workflowService,
      _workflowBuilder,
      _config,
      _toolkitConfiguration);
  }
}
