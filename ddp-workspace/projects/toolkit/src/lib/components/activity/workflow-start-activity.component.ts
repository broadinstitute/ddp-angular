import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';
import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
// import {
//   ActivityResponse,
//   CompositeDisposable,
//   ConfigurationService,
//   SessionMementoService,
//   TemporaryUser,
//   TemporaryUserServiceAgent,
//   WorkflowServiceAgent,
//   WindowRef
// } from 'ddp-sdk';
import {CompositeDisposable} from "../../../../../ddp-sdk/src/lib/compositeDisposable";
import {TemporaryUserServiceAgent} from "../../../../../ddp-sdk/src/lib/services/serviceAgents/temporaryUserServiceAgent.service";
import {WindowRef} from "../../../../../ddp-sdk/src/lib/services/windowRef";
import {WorkflowServiceAgent} from "../../../../../ddp-sdk/src/lib/services/serviceAgents/workflowServiceAgent.service";
import {SessionMementoService} from "../../../../../ddp-sdk/src/lib/services/sessionMemento.service";
import {ConfigurationService} from "../../../../../ddp-sdk/src/lib/services/configuration.service";
import {ActivityResponse} from "../../../../../ddp-sdk/src/lib/models/activity/activityResponse";
import {TemporaryUser} from "../../../../../ddp-sdk/src/lib/models/temporaryUser";
import { filter, map, mergeMap, take } from 'rxjs/operators';

@Component({
  selector: 'toolkit-workflow-start-activity',
  template: `
      <toolkit-header [showButtons]="false"
                      [stickySubtitle]="stickySubtitle">
      </toolkit-header>
      <ddp-activity *ngIf="show"
                    [studyGuid]="studyGuid"
                    [activityGuid]="instanceGuid"
                    (submit)="navigate($event)"
                    (stickySubtitle)="showStickySubtitle($event)">
      </ddp-activity>`
})
export class WorkflowStartActivityComponent implements OnInit, OnDestroy {
  public studyGuid: string;
  public instanceGuid: string;
  public stickySubtitle: string;
  public show = true;
  public activityCode: string;
  private anchor: CompositeDisposable = new CompositeDisposable();

  constructor(
    private workflowBuilder: WorkflowBuilderService,
    private temporaryUserService: TemporaryUserServiceAgent,
    private session: SessionMementoService,
    private workflow: WorkflowServiceAgent,
    private windowRef: WindowRef,
    private cdr: ChangeDetectorRef,
    @Inject('ddp.config') private configuration: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    this.studyGuid = this.toolkitConfiguration.studyGuid;
    this.fetchActivity();
  }

  public ngOnDestroy(): void {
    this.anchor.removeAll();
  }

  public navigate(response: ActivityResponse): void {
    const convertedResponse = this.convertWorkflowResponse(response);
    const sub = this.workflowBuilder.getCommand(convertedResponse).execute().subscribe(() => {
      this.resetActivityComponent();
      this.fetchActivity();
    });
    this.anchor.addNew(sub);
  }

  // force the activity component to reset it by removing and adding it again
  private resetActivityComponent(): void {
    this.show = false;
    this.cdr.detectChanges();
    this.show = true;
    // need to scroll to top after done! This is more visible in mobile
    this.windowRef.nativeWindow.scrollTo(0, 0);
  }

  public showStickySubtitle(stickySubtitle: string): void {
    this.stickySubtitle = stickySubtitle;
  }

  private fetchActivity(): void {
    if (this.session.isAuthenticatedSession()) {
      this.workflow.getStart().pipe(take(1)).subscribe((response: ActivityResponse | null) => {
        if (response && response.instanceGuid) {
          this.instanceGuid = response.instanceGuid;
        }
      });
    } else {
      this.temporaryUserService.createTemporaryUser(this.configuration.auth0ClientId).pipe(
        filter(x => x !== null),
        map((user: TemporaryUser) => this.session.setTemporarySession(user)),
        mergeMap(() => this.workflow.getStart()),
        take(1)
      ).subscribe((response: ActivityResponse | null) => {
        if (response && response.instanceGuid) {
          this.instanceGuid = response.instanceGuid;
        }
      });
    }
  }

  private convertWorkflowResponse(response: ActivityResponse): ActivityResponse {
    if (this.session.isTemporarySession() && (response.allowUnauthenticated === false)) {
      return new ActivityResponse('REGISTRATION');
    } else {
      return response;
    }
  }
}
