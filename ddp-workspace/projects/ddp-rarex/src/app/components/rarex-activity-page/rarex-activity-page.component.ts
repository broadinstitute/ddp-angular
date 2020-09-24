import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, of } from 'rxjs';

import {
  ActivityResponse,
  ActivityInstance,
  CompositeDisposable,
  LoggingService,
  UserActivityServiceAgent,
  UserActivitiesDataSource,
} from 'ddp-sdk';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';

@Component({
  selector: 'app-rarex-activity-page',
  templateUrl: './rarex-activity-page.component.html',
  styleUrls: ['./rarex-activity-page.component.scss']
})
export class RarexActivityPageComponent implements OnInit, OnDestroy {
  studyGuid: string;
  activityGuid: string;
  activities: ActivityInstance[];

  private _userActivitesSub: Subscription;
  private _anchor = new CompositeDisposable();

  @ViewChild('activityContainer', { static: false }) private _activityContainerRef: ElementRef;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _userActivites: UserActivityServiceAgent,
    private readonly _logger: LoggingService,
    private readonly _workflowBuilder: WorkflowBuilderService,
    @Inject('toolkit.toolkitConfig') private _toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this._toolkitConfiguration.studyGuid;

    this._anchor.addNew(
      this._route.params.subscribe(data => {
        this.activityGuid = data.id;
      })
    );

    this.getActivities();
  }

  ngOnDestroy(): void {
    this._anchor.removeAll();
  }

  onSubmit(activityResponse: ActivityResponse): void {
    if (activityResponse && activityResponse.instanceGuid) {
      this.activityGuid = activityResponse.instanceGuid;
      this.getActivities();

      return;
    }

    this._workflowBuilder
      .getCommand(new ActivityResponse(activityResponse.next))
      .execute();
  }

  onSectionChanged() {
    this._activityContainerRef.nativeElement.scrollTo(0, 0);
  }

  private getActivities(): void {
    if (this._userActivitesSub) {
      this._userActivitesSub.unsubscribe();
    }

    this._userActivitesSub = new UserActivitiesDataSource(
      this._userActivites,
      this._logger,
      of(this.studyGuid)
    )
      .connect()
      .subscribe(activities => {
        this.activities = activities;
      });
  }
}
