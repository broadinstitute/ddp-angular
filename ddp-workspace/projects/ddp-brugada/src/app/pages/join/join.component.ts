import { Component, Inject, OnInit } from '@angular/core';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ActivityResponse,
  ConfigurationService,
  LoggingService,
  SessionMementoService,
  TemporaryUserServiceAgent,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { WorkflowBuilderService } from 'toolkit';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss'],
})
export class JoinComponent implements OnInit {
  prequalInstanceGuid: string;
  studyGuid = this.config.studyGuid;
  readonly LOG_SOURCE = 'JoinComponent';

  constructor(
    private sessionService: SessionMementoService,
    private temporaryUserService: TemporaryUserServiceAgent,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilderService: WorkflowBuilderService,
    private loggingService: LoggingService,
    @Inject('ddp.config') private config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    if (this.sessionService.isAuthenticatedSession()) {
      this.getNext();
    } else {
      this.getStart();
    }
  }

  private getNext(): void {
    this.workflowService
      .getNext()
      .pipe(take(1))
      .subscribe(response => {
        this.workflowBuilderService.getCommand(response).execute();
      });
  }

  private getStart(): void {
    this.temporaryUserService
      .createTemporaryUser(this.config.auth0ClientId)
      .pipe(
        tap(user => this.sessionService.setTemporarySession(user)),
        switchMap(() => this.workflowService.getStart()),
        take(1),
      )
      .subscribe(response => {
        if (!response) {
          this.loggingService.logError(
            this.LOG_SOURCE,
            `Tried to get "START" workflow but response was: ${response}`,
          );

          return;
        }

        this.prequalInstanceGuid = response.instanceGuid;
      });
  }
}
