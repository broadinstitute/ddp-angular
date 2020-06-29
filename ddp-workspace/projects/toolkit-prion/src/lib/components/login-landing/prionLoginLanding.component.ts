import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginLandingComponent, ToolkitConfigurationService, WorkflowBuilderService } from "toolkit";
import {
  Auth0AdapterService,
  ConfigurationService,
  GovernedParticipantsServiceAgent,
  SessionMementoService,
  WorkflowServiceAgent
} from "ddp-sdk";

@Component({
  selector: 'prion-login-landing',
  template: `    
      <prion-common-landing></prion-common-landing>    
  `
})
export class PrionLoginLandingComponent extends LoginLandingComponent implements OnInit, OnDestroy {
  constructor(
    private _router: Router,
    private _auth0: Auth0AdapterService,
    private _sessionService: SessionMementoService,
    private _participantService: GovernedParticipantsServiceAgent,
    private _workflowService: WorkflowServiceAgent,
    private _workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') private _config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
    super(_router, _auth0, _sessionService, _participantService, _workflowService, _workflowBuilder, _config,
      _toolkitConfiguration);
  }
}
