import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { mergeMap, take, tap } from 'rxjs/operators';

import {
  ActivityResponse,
  ConfigurationService,
  SessionMementoService,
  TemporaryUserServiceAgent,
  WorkflowServiceAgent,
} from 'ddp-sdk';

import { WorkflowBuilderService } from 'toolkit';

import { MailingListModalComponent } from '../../mailing-list-modal/mailing-list-modal.component';

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
    private dialog: MatDialog,
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
      this.dialog.open(MailingListModalComponent, {
        width: '100%',
        maxWidth: '640px',
        disableClose: true,
        autoFocus: false,
      });

      return;
    }

    if (!response.allowUnauthenticated) {
      this.workflowBuilderService
        .getCommand(new ActivityResponse(this.REGISTRATION_WORKFLOW))
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
