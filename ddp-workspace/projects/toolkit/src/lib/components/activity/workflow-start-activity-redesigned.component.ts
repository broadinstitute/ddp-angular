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
  selector: 'toolkit-workflow-start-activity',
  template: `
      <ddp-activity-redesigned *ngIf="show"
                               [studyGuid]="studyGuid"
                               [activityGuid]="instanceGuid"
                               (submit)="navigate($event)"
                               (stickySubtitle)="showStickySubtitle($event)"
                               (activityCode)="activityCodeChanged($event)"
                               (sectionsVisibilityChanged)="sectionsVisibilityChanged($event)">
      </ddp-activity-redesigned>`
})
export class WorkflowStartActivityRedesignedComponent extends WorkflowStartActivityComponent implements OnInit {
  constructor(
    private headerConfig: HeaderConfigurationService,
    workflowBuilder: WorkflowBuilderService,
    temporaryUserService: TemporaryUserServiceAgent,
    session: SessionMementoService,
    workflow: WorkflowServiceAgent,
    windowRef: WindowRef,
    cdr: ChangeDetectorRef,
    @Inject('ddp.config') configuration: ConfigurationService,
    @Inject('toolkit.toolkitConfig') toolkitConfiguration: ToolkitConfigurationService) {
    super(
      workflowBuilder,
      temporaryUserService,
      session,
      workflow,
      windowRef,
      cdr,
      configuration,
      toolkitConfiguration);
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
