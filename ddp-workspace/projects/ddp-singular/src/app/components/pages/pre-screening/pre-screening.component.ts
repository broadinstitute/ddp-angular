import { WorkflowBuilderService } from 'toolkit';
import { switchMap, take, tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivityResponse, ConfigurationService, SessionMementoService, TemporaryUserServiceAgent, WorkflowServiceAgent } from 'ddp-sdk';


@Component({
  selector: 'app-pre-screening',
  templateUrl: './pre-screening.component.html',
  styleUrls: ['./pre-screening.component.scss']
})
export class PreScreeningComponent implements OnInit {
  studyGuid: string;
  instanceGuid: string;

  constructor(
    private sessionService: SessionMementoService,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilderService: WorkflowBuilderService,
    private temporaryUserService: TemporaryUserServiceAgent,
    @Inject('ddp.config') private configurationService: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this.configurationService.studyGuid;

    this.checkSession();
  }

  onSubmit(response: ActivityResponse): void {
    if (!response.allowUnauthenticated) {
      this.workflowBuilderService
        .getCommand(new ActivityResponse('REGISTRATION'))
        .execute();
    }
  }

  private checkSession(): void {
    const isAuthenticated =
      this.sessionService.isAuthenticatedSession() ||
      this.sessionService.isAuthenticatedAdminSession();

    if (isAuthenticated) {
      this.getNextWorkflow();
    } else {
      this.getStartWorkflow();
    }
  }

  private getNextWorkflow(): void {
    this.workflowService
      .getNext()
      .pipe(take(1))
      .subscribe(response => {
        this.workflowBuilderService.getCommand(response).execute();
      });
  }

  private getStartWorkflow(): void {
    this.temporaryUserService
      .createTemporaryUser(this.configurationService.auth0ClientId)
      .pipe(
        tap(temporaryUser =>
          this.sessionService.setTemporarySession(temporaryUser),
        ),
        switchMap(() => this.workflowService.getStart()),
        take(1),
      )
      .subscribe(response => {
        this.instanceGuid = response.instanceGuid;
      });
  }
}
