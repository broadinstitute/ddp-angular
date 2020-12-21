import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';
import { filter, map, mergeMap, take } from 'rxjs/operators';
import {
  ActivityResponse,
  Auth0AdapterService,
  CompositeDisposable,
  ConfigurationService,
  SessionMementoService,
  TemporaryUser,
  TemporaryUserServiceAgent,
  WindowRef,
  WorkflowServiceAgent,
  LoggingService,
} from 'ddp-sdk';

import { MultiGovernedUserService } from '../../services/multi-governed-user.service';
import { UserInfo } from '../../models/userInfo';
import * as Routes from '../../router-resources';

@Component({
  selector: `app-join-us`,
  styleUrls: ['./join-us.scss'],
  template: `
    <div class="join-us">
      <div class="page-padding">
        <div class="row">
          <div class="col-lg-5 col-md-6 col-sm-8 col-xs-12">
            <app-atcp-activity-base
              [studyGuid]="studyGuid"
              [activityGuid]="instanceGuid"
              [isPrequal]="true"
              (submit)="navigate($event)"
              (stickySubtitle)="showStickySubtitle($event)"
              #activity
            >
            </app-atcp-activity-base>
            <div *ngIf="activity.isLoaded" class="helpHint align-center">
              <a (click)="signIn()" translate>JoinUs.SignInButton</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class JoinUsComponent implements OnInit, OnDestroy {
  public SignIn: string;
  public id: string;
  public studyGuid: string;
  public instanceGuid: string;
  public stickySubtitle: string;
  public show = true;

  private anchor: CompositeDisposable = new CompositeDisposable();

  private readonly MAILING_LIST_WORKFLOW = 'MAILING_LIST';
  private readonly REGISTRATION_WORKFLOW = 'REGISTRATION';

  constructor(
    private hostEl: ElementRef,
    private router: Router,
    private multiGovernedUserService: MultiGovernedUserService,
    private cdr: ChangeDetectorRef,
    @Inject('toolkit.toolkitConfig')
    private toolkitConfiguration: ToolkitConfigurationService,
    @Inject('ddp.config') private configuration: ConfigurationService,
    private windowRef: WindowRef,
    private workflowBuilder: WorkflowBuilderService,
    private session: SessionMementoService,
    private temporaryUserService: TemporaryUserServiceAgent,
    private workflow: WorkflowServiceAgent,
    private auth0: Auth0AdapterService,
    private loggingService: LoggingService
  ) {}

  public ngOnInit(): void {
    if (this.session.isAuthenticatedSession()) {
      this.multiGovernedUserService.navigateToDashboard();
    }

    this.studyGuid = this.toolkitConfiguration.studyGuid;
    this.fetchActivity();
  }

  public showStickySubtitle(stickySubtitle: string): void {
    this.stickySubtitle = stickySubtitle;
  }

  private fetchActivity(): void {
    if (this.session.isAuthenticatedSession()) {
      this.workflow
        .getNext()
        .pipe(take(1))
        .subscribe(activityResponse => {
          this.workflowBuilder.getCommand(activityResponse).execute();
        });
    } else {
      this.temporaryUserService
        .createTemporaryUser(this.configuration.auth0ClientId)
        .pipe(
          filter(x => x !== null),
          map((user: TemporaryUser) => this.session.setTemporarySession(user)),
          mergeMap(() => this.workflow.getStart()),
          take(1)
        )
        .subscribe((response: ActivityResponse | null) => {
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
    if (response.next === this.MAILING_LIST_WORKFLOW) {
      const user = this.getName();

      this.router.navigate([Routes.MailingList], {
        queryParams: user,
      });

      return;
    }

    const convertedResponse = this.convertWorkflowResponse(response);

    if (convertedResponse.next === this.REGISTRATION_WORKFLOW) {
      const userInfo = this.getName();

      this.auth0.signup({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
      });

      return;
    }

    const sub = this.workflowBuilder
      .getCommand(convertedResponse)
      .execute()
      .subscribe(() => {
        this.resetActivityComponent();
        this.fetchActivity();
      });
    this.anchor.addNew(sub);
  }

  private convertWorkflowResponse(
    response: ActivityResponse
  ): ActivityResponse {
    this.loggingService.logEvent(
      'Received a response after submitting prequal',
      response
    );

    if (!response.allowUnauthenticated) {
      const registrationActivityResponse = new ActivityResponse(
        this.REGISTRATION_WORKFLOW
      );

      this.loggingService.logEvent(
        `
        Activity response doesn't allow unauthenticated users to proceed,
        creating a REGISTRATION type activity response
      `,
        registrationActivityResponse
      );

      return registrationActivityResponse;
    } else {
      return response;
    }
  }

  private getName(): UserInfo {
    const inputs = this.hostEl.nativeElement.querySelectorAll(
      'input.mat-input-element'
    );

    return {
      firstName: inputs[0].value,
      lastName: inputs[1].value,
    };
  }

  public signIn(): void {
    this.auth0.login();
  }

  ngOnDestroy(): void {
    this.anchor.removeAll();
  }
}
