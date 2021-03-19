import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { WorkflowStartActivityComponent } from './workflow-start-activity.component';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { HeaderConfigurationService } from '../../services/headerConfiguration.service';
import {
  ConfigurationService,
  SessionMementoService,
  TemporaryUserServiceAgent,
  WorkflowServiceAgent,
  WindowRef
} from 'ddp-sdk';

@Component({
  selector: 'toolkit-workflow-start-activity-redesigned',
  template: `
      <ddp-activity-redesigned *ngIf="show"
                               [studyGuid]="studyGuid"
                               [activityGuid]="instanceGuid"
                               [agreeConsent]="_toolkitConfiguration.agreeConsent"
                               (submit)="navigate($event)"
                               (stickySubtitle)="showStickySubtitle($event)"
                               (activityCode)="activityCodeChanged($event)"
                               (sectionsVisibilityChanged)="sectionsVisibilityChanged($event)">
      </ddp-activity-redesigned>`
})
export class WorkflowStartActivityRedesignedComponent extends WorkflowStartActivityComponent implements OnInit {
  constructor(
    private headerConfig: HeaderConfigurationService,
    private _workflowBuilder: WorkflowBuilderService,
    private _temporaryUserService: TemporaryUserServiceAgent,
    private _session: SessionMementoService,
    private _workflow: WorkflowServiceAgent,
    private _windowRef: WindowRef,
    private _cdr: ChangeDetectorRef,
    @Inject('ddp.config') private _configuration: ConfigurationService,
    @Inject('toolkit.toolkitConfig') public _toolkitConfiguration: ToolkitConfigurationService) {
    super(_workflowBuilder,
      _temporaryUserService,
      _session,
      _workflow,
      _windowRef,
      _cdr,
      _configuration,
      _toolkitConfiguration);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.headerConfig.setupActivityHeader();
  }

  public showStickySubtitle(stickySubtitle: string): void {
    this.headerConfig.stickySubtitle = stickySubtitle;
  }

  public activityCodeChanged(code: string): void {
    this.headerConfig.currentActivityCode = code;
  }

  public sectionsVisibilityChanged(count: number): void {
    this.headerConfig.workflowStartSectionsVisibility = count;
  }
}
