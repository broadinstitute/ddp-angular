import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import {
  LoggingService,
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';

import { AtcpCommunicationService } from '../services/communication.service';
import { AtcpLoginLandingComponent } from './atcp-login-landing.component';

@Component({
  selector: 'app-atcp-login-landing-redesigned',
  template: `
    <toolkit-common-landing-redesigned></toolkit-common-landing-redesigned>
  `,
})
export class AtcpLoginLandingRedesignedComponent extends AtcpLoginLandingComponent {
  constructor(
    router: Router,
    auth0: Auth0AdapterService,
    sessionService: SessionMementoService,
    workflowService: WorkflowServiceAgent,
    workflowBuilder: WorkflowBuilderService,
    log: LoggingService,
    communicationService: AtcpCommunicationService,
    translateService: TranslateService,
    @Inject('ddp.config') config: ConfigurationService,
    @Inject('toolkit.toolkitConfig')
    toolkitConfiguration: ToolkitConfigurationService,
  ) {
    super(
      router,
      auth0,
      sessionService,
      workflowService,
      workflowBuilder,
      log,
      communicationService,
      translateService,
      config,
      toolkitConfiguration,
    );
  }
}
