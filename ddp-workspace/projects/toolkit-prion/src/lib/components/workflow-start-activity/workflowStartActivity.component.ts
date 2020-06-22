import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import {
  ConfigurationService,
  SessionMementoService,
  TemporaryUserServiceAgent,
  WorkflowServiceAgent,
  WindowRef
} from 'ddp-sdk';
import { ToolkitConfigurationService, WorkflowBuilderService, WorkflowStartActivityComponent } from "toolkit";

@Component({
  selector: 'toolkit-workflow-start-activity',
  template: `
    <ng-container>
      <toolkit-header>
      </toolkit-header>
      <div class="ContainerSurvey-top row">
            <ddp-activity *ngIf="show" 
                    [studyGuid]="studyGuid"
                    [activityGuid]="instanceGuid"
                    (submit)="navigate($event)"
                    class="ContainerSurvey col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12">
      </ddp-activity>
        </div>
</ng-container>`
})
export class PrionWorkflowStartActivityComponent extends WorkflowStartActivityComponent implements OnInit, OnDestroy {

  constructor(
    private _workflowBuilder: WorkflowBuilderService,
    private _temporaryUserService: TemporaryUserServiceAgent,
    private _session: SessionMementoService,
    private _workflow: WorkflowServiceAgent,
    private _windowRef: WindowRef,
    private _cdr: ChangeDetectorRef,
    @Inject('ddp.config') private _configuration: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService) {
    super(_workflowBuilder, _temporaryUserService, _session, _workflow, _windowRef, _cdr, _configuration, _toolkitConfiguration);
  }


}
