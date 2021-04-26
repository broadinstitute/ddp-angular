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
  selector: 'app-share-my-data',
  templateUrl: './share-my-data.component.html',
  styleUrls: ['./share-my-data.component.scss'],
})
export class ShareMyDataComponent implements OnInit {
  studyGuid: string;
  instanceGuid: string;

  constructor(
    private sessionService: SessionMementoService,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilderService: WorkflowBuilderService,
    private tempUserService: TemporaryUserServiceAgent,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this.config.studyGuid;

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
    this.tempUserService
      .createTemporaryUser(this.config.auth0ClientId)
      .pipe(
        tap(tempUser => this.sessionService.setTemporarySession(tempUser)),
        mergeMap(() => this.workflowService.getStart()),
        take(1),
      )
      .subscribe(response => {
        this.instanceGuid = response.instanceGuid;
      });
  }
}
