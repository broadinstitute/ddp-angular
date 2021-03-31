import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import {
  ActivityResponse,
  ActivityInstance,
  CompositeDisposable,
  LoggingService,
  UserActivityServiceAgent,
  SessionMementoService,
} from 'ddp-sdk';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';

import { CurrentActivityService } from '../../services/current-activity.service';
import { ActivityCodes } from '../../constants/activity-codes';
import { ActivityStatusCodes } from '../../constants/activity-status-codes';
import { RoutePaths } from '../../router-resources';

@Component({
  selector: 'app-rarex-activity-page',
  templateUrl: './rarex-activity-page.component.html',
  styleUrls: ['./rarex-activity-page.component.scss'],
})
export class RarexActivityPageComponent implements OnInit, OnDestroy {
  studyGuid: string;
  instanceGuid: string;
  isReadonly: boolean;
  activities: ActivityInstance[];
  isWorkflowProgressShown: boolean;
  isActivityShown = true;
  isFetchingActivities = false;

  private _anchor = new CompositeDisposable();

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _cdr: ChangeDetectorRef,
    private readonly _currentActivity: CurrentActivityService,
    private readonly _userActivites: UserActivityServiceAgent,
    private readonly _logger: LoggingService,
    private readonly _workflowBuilder: WorkflowBuilderService,
    private readonly _session: SessionMementoService,
    @Inject('toolkit.toolkitConfig')
    private _toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this._toolkitConfiguration.studyGuid;
    const activity = this._currentActivity.activity$.getValue();

    if (!activity) {
      this._router.navigateByUrl(RoutePaths.Dashboard);

      return;
    }

    this.getActivities().pipe(take(1)).subscribe();
    this.instanceGuid = activity.instance.instanceGuid;
    this.isReadonly = activity.isReadonly;
  }

  ngOnDestroy(): void {
    this._currentActivity.activity$.next(null);
    this._session.setParticipant(null);
    this._anchor.removeAll();
  }

  onSubmit(activityResponse: ActivityResponse): void {
    if (activityResponse && activityResponse.instanceGuid) {
      this.resetActivityComponent();

      this.instanceGuid = activityResponse.instanceGuid;
      this.getActivities().pipe(take(1)).subscribe();

      return;
    }

    this._workflowBuilder
      .getCommand(new ActivityResponse(activityResponse.next))
      .execute();
  }

  onChangeActivity(activity: ActivityInstance): void {
    this.instanceGuid = activity.instanceGuid;
    this.resetActivityComponent();
  }

  private getActivities(): Observable<ActivityInstance[]> {
    this.isFetchingActivities = true;

    return this._userActivites.getActivities(of(this.studyGuid)).pipe(
      tap(activities => {
        this.isFetchingActivities = false;

        if (!activities) return;

        this.activities = activities;

        const demographicsActivity = activities.find(
          activity => activity.activityCode === ActivityCodes.DEMOGRAPHICS,
        );

        this.isWorkflowProgressShown = demographicsActivity
          ? demographicsActivity.statusCode === ActivityStatusCodes.COMPLETE
          : false;
      }),
    );
  }

  private resetActivityComponent(): void {
    this.isActivityShown = false;
    this._cdr.detectChanges();
    this.isActivityShown = true;
  }
}
