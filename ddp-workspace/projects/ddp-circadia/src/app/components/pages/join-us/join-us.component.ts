import { Component, Inject, OnInit } from '@angular/core';
import { mergeMap, take, tap } from 'rxjs/operators';

import {
  ActivityResponse,
  ConfigurationService,
  SessionMementoService,
  TemporaryUserServiceAgent,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { WorkflowBuilderService } from 'toolkit';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss'],
})
export class JoinUsComponent implements OnInit {
  studyGuid: string;
  instanceGuid: string;
  private readonly MAILING_LIST_WORKFLOW = 'MAILING_LIST';
  private readonly REGISTRATION_WORKFLOW = 'REGISTRATION';

  constructor(
    private sessionService: SessionMementoService,
    private temporaryUserService: TemporaryUserServiceAgent,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilderService: WorkflowBuilderService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.checkSession();
  }

  onSubmit(response: ActivityResponse): void {
    if (response.next === this.MAILING_LIST_WORKFLOW) {
      // handle mailing list
    }

    if (!response.allowUnauthenticated) {
      this.workflowBuilderService
        .getCommand(new ActivityResponse(this.REGISTRATION_WORKFLOW))
        .execute();
    }

    console.log(response);
  }

  private checkSession(): void {
    if (this.sessionService.isAuthenticatedSession()) {
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
      .createTemporaryUser(this.config.auth0ClientId)
      .pipe(
        tap(user => this.sessionService.setTemporarySession(user)),
        mergeMap(() => this.workflowService.getStart()),
        take(1),
      )
      .subscribe(response => {
        this.studyGuid = this.config.studyGuid;
        this.instanceGuid = response.instanceGuid;
      });
  }
}
