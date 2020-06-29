import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { GovernedParticipantsServiceAgent, Participant } from 'ddp-sdk';

import { WorkflowBuilderService } from '../../services/workflowBuilder.service';
import { ToolkitConfigurationService } from '../../services/toolkitConfiguration.service';

import { Subscription } from 'rxjs';
import { filter, take, mergeMap, tap } from 'rxjs/operators';

import {
  SessionMementoService,
  Auth0AdapterService,
  ConfigurationService,
  WorkflowServiceAgent
} from 'ddp-sdk';

@Component({
  selector: 'toolkit-login-landing',
  template: `
      <toolkit-common-landing></toolkit-common-landing>
  `
})
export class LoginLandingComponent implements OnInit, OnDestroy {
  private anchor: Subscription;

  constructor(
    private router: Router,
    private auth0: Auth0AdapterService,
    private sessionService: SessionMementoService,
    private participantService: GovernedParticipantsServiceAgent,
    private workflowService: WorkflowServiceAgent,
    private workflowBuilder: WorkflowBuilderService,
    @Inject('ddp.config') private config: ConfigurationService,
    @Inject('toolkit.toolkitConfig') private toolkitConfiguration: ToolkitConfigurationService) { }

  public ngOnInit(): void {
    if (!this.config.doLocalRegistration && location.hash) {
      // if we're doing local registration, session has already been set
      // and logging out and parsing hash will fail
      this.auth0.handleAuthentication(this.handleAuthError.bind(this));
    } else if (!this.config.doLocalRegistration && !location.hash) {
      this.redirect();
    }

    // Subscribe to session observable, so once auth session is set, then we redirect.
    this.anchor = this.sessionService.sessionObservable.pipe(
      filter(session => session !== null && !!session.idToken),
      take(1),
      mergeMap(() => this.participantService.getGovernedStudyParticipants(this.config.studyGuid)),
      tap(participants => this.setFirstParticipant(participants))
    ).subscribe(() => {
      this.redirect();
    });
  }

  public ngOnDestroy(): void {
    // Subscription might not have been initialized if we encountered auth error and get unloaded.
    this.anchor && this.anchor.unsubscribe();
  }

  private handleAuthError(error: any | null): void {
    if (error) {
      console.error(error);
    }
    this.router.navigateByUrl(this.toolkitConfiguration.errorUrl);
  }

  private redirect(): void {
    const nextUrlFromStorage = sessionStorage.getItem('nextUrl');
    if (nextUrlFromStorage) {
      // `nextUrl` is set before redirecting to auth0. If it exists, then pick up where we left off.
      sessionStorage.removeItem('nextUrl');
      this.router.navigateByUrl(nextUrlFromStorage);
    } else {
      // No `nextUrl` set before going to auth0, query the workflow service to get where to go next.
      this.workflowService.getNext()
        .pipe(take(1))
        .subscribe(response => response && this.workflowBuilder.getCommand(response).execute());
    }
  }

  private setFirstParticipant(participants: Array<Participant>): void {
    if (participants && participants.length) {
      const participantGuid = participants[0].userGuid;
      this.sessionService.setParticipant(participantGuid);
    }
  }
}
