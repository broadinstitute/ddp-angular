import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map, mergeMap, take } from 'rxjs/operators';

import {
  SessionMementoService,
  TemporaryUserServiceAgent,
  ConfigurationService,
  WorkflowServiceAgent,
  ActivityResponse,
} from 'ddp-sdk';

import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';

import { RoutePaths } from '../../router-resources';

@Component({
  selector: 'app-share-my-data',
  templateUrl: './share-my-data.component.html',
  styleUrls: ['./share-my-data.component.scss']
})
export class ShareMyDataComponent implements OnInit {
  studyGuid: string;
  activityGuid: string;

  constructor(
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService,
    @Inject('ddp.config') private _configuration: ConfigurationService,
    private _session: SessionMementoService,
    private _temporaryUserService: TemporaryUserServiceAgent,
    private _workflow: WorkflowServiceAgent,
    private _workflowBuilder: WorkflowBuilderService,
    private _router: Router,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this._toolkitConfiguration.studyGuid;

    this.fetchActivity();
  }

  onSubmit(activityResponse: ActivityResponse): void {
    let response = activityResponse;

    if (this._session.isTemporarySession() && !activityResponse.allowUnauthenticated)  {
      response = new ActivityResponse('REGISTRATION');

      sessionStorage.setItem('nextUrl', RoutePaths.Consent);
    }

    this._workflowBuilder.getCommand(response).execute();
  }

  private fetchActivity(): void {
    if (this._session.isAuthenticatedSession()) {
      this._router.navigateByUrl(RoutePaths.Dashboard);

      return;
    }

    this._temporaryUserService
        .createTemporaryUser(this._configuration.auth0ClientId)
        .pipe(
          filter(x => x !== null),
          map(user => this._session.setTemporarySession(user)),
          mergeMap(() => this._workflow.getStart()),
          take(1),
        )
        .subscribe((response: ActivityResponse | null) => {
          if (response && response.instanceGuid) {
            this.activityGuid = response.instanceGuid;
          }
        });
  }
}
