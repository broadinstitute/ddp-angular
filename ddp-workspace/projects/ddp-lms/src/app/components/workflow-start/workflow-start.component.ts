import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {
  HeaderConfigurationService,
  ToolkitConfigurationService,
  WorkflowBuilderService,
  WorkflowStartActivityRedesignedComponent
} from 'toolkit';
import {
  ActivityResponse,
  ConfigurationService,
  SessionMementoService,
  SessionStorageService,
  TemporaryUserServiceAgent,
  WindowRef,
  WorkflowServiceAgent
} from 'ddp-sdk';

@Component({
  selector: 'app-workflow-start',
  templateUrl: './workflow-start.component.html'
})
export class WorkflowStartComponent extends WorkflowStartActivityRedesignedComponent implements OnInit {

  constructor(
    private _headerConfig: HeaderConfigurationService,
    private __workflowBuilder: WorkflowBuilderService,
    private __temporaryUserService: TemporaryUserServiceAgent,
    private __session: SessionMementoService,
    private __workflow: WorkflowServiceAgent,
    private __windowRef: WindowRef,
    private __cdr: ChangeDetectorRef,
    _sessionStorageService: SessionStorageService,
    @Inject('ddp.config') private __configuration: ConfigurationService,
    @Inject('toolkit.toolkitConfig') public __toolkitConfiguration: ToolkitConfigurationService) {
    super(
      _headerConfig,
      __workflowBuilder,
      __temporaryUserService,
      __session,
      __workflow,
      __windowRef,
      __cdr,
      _sessionStorageService,
      __configuration,
      __toolkitConfiguration
    );
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  onSubmit(response: ActivityResponse): void {
    if(!('allowUnauthenticated' in response)){
      response.allowUnauthenticated = false;
    }
    super.navigate(response);
  }

}