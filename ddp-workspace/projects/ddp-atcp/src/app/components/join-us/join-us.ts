import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import {
  ActivityResponse, CompositeDisposable,
  ConfigurationService,
  SessionMementoService,
  TemporaryUser,
  TemporaryUserServiceAgent, WindowRef,
  WorkflowServiceAgent
} from 'ddp-sdk';

@Component({
  selector: `app-join-us`,
  styleUrls: ['./join-us.scss'],
  template: `
    <div class="join-us">
      <app-header></app-header>
      <div class="page-padding">
        <ddp-activity [studyGuid]="studyGuid"
                      [activityGuid]="instanceGuid"
                      (submit)="navigate($event)"
                      (stickySubtitle)="showStickySubtitle($event)">
        </ddp-activity>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class JoinUsComponent implements OnInit {
  public SignIn: string;
  public id: string;
  public studyGuid: string;
  public instanceGuid: string;
  public stickySubtitle: string;
  public show = true;
  private anchor: CompositeDisposable = new CompositeDisposable();

  constructor(private cdr: ChangeDetectorRef,
              @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService,
              @Inject('ddp.config') private configuration: ConfigurationService,
              private windowRef: WindowRef,
              private workflowBuilder: WorkflowBuilderService,
              private session: SessionMementoService,
              private temporaryUserService: TemporaryUserServiceAgent,
              private workflow: WorkflowServiceAgent) {
  }

  public ngOnInit(): void {
    this.studyGuid = this.toolkitConfiguration.studyGuid;
    this.fetchActivity();
  }

  public showStickySubtitle(stickySubtitle: string): void {
    this.stickySubtitle = stickySubtitle;
  }

  private fetchActivity(): void {
    if (this.session.isAuthenticatedSession()) {
      this.workflow.getStart(this.studyGuid).pipe(take(1)).subscribe((response: ActivityResponse | null) => {
        if (response && response.instanceGuid) {
          this.instanceGuid = response.instanceGuid;
        }
      });
    } else {
      this.temporaryUserService.createTemporaryUser(this.configuration.auth0ClientId).pipe(
        filter(x => x !== null),
        map((user: TemporaryUser) => this.session.setTemporarySession(user)),
        mergeMap(() => this.workflow.getStart(this.studyGuid)),
        take(1)
      ).subscribe((response: ActivityResponse | null) => {
        if (response && response.instanceGuid) {
          this.instanceGuid = response.instanceGuid;
        }
      });
    }
  }

  // force the activity component to reset it by removing and adding it again
  private resetActivityComponent(): void {
    this.show = false;
    this.cdr.detectChanges();
    this.show = true;
    // need to scroll to top after done! This is more visible in mobile
    this.windowRef.nativeWindow.scrollTo(0, 0);
  }

  public navigate(response: ActivityResponse): void {
    const convertedResponse = this.convertWorkflowResponse(response);
    const sub = this.workflowBuilder.getCommand(convertedResponse).execute().subscribe(() => {
      this.resetActivityComponent();
      this.fetchActivity();
    });
    this.anchor.addNew(sub);
  }

  private convertWorkflowResponse(response: ActivityResponse): ActivityResponse {
    if (this.session.isTemporarySession() && (response.allowUnauthenticated === false)) {
      return new ActivityResponse('REGISTRATION');
    } else {
      return response;
    }
  }
}
