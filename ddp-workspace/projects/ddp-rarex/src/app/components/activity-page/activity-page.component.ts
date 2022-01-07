import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, take } from 'rxjs/operators';

import {
  ActivityResponse,
  ActivityInstance,
  CompositeDisposable,
  UserActivityServiceAgent,
  SessionMementoService,
  ActivityStatusCodes,
} from 'ddp-sdk';
import { ToolkitConfigurationService, WorkflowBuilderService } from 'toolkit';

import { CurrentActivityService } from '../../services/current-activity.service';
import { GovernedUserService } from '../../services/governed-user.service';
import { ActivityCodes } from '../../constants/activity-codes';

@Component({
  selector: 'app-activity-page',
  templateUrl: './activity-page.component.html',
  styleUrls: ['./activity-page.component.scss'],
})
export class ActivityPageComponent implements OnInit, OnDestroy {
  studyGuid: string;
  instanceGuid: string;
  isReadonly: boolean;
  hasPreviousInstance: boolean;
  activities: ActivityInstance[];
  isWorkflowProgressShown: boolean;
  isActivityShown = true;
  isFetchingActivities = false;

  private _anchor = new CompositeDisposable();

  constructor(
    private readonly _cdr: ChangeDetectorRef,
    private readonly _currentActivity: CurrentActivityService,
    private readonly _userActivites: UserActivityServiceAgent,
    private readonly _workflowBuilder: WorkflowBuilderService,
    private readonly _session: SessionMementoService,
    private governedUserService: GovernedUserService,
    @Inject('toolkit.toolkitConfig')
    private _toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    this.studyGuid = this._toolkitConfiguration.studyGuid;
    const activity = this._currentActivity.activity$.getValue();

    if (!activity) {
      this.governedUserService.redirectToDashboard();

      return;
    }

    this.getActivities().pipe(take(1)).subscribe();
    this.instanceGuid = activity.instance.instanceGuid;
    this.isReadonly = activity.isReadonly;
    this.hasPreviousInstance = !!activity.instance.previousInstanceGuid;
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
    this.hasPreviousInstance = !!activity.previousInstanceGuid;
    this.resetActivityComponent();
  }

  private getActivities(): Observable<ActivityInstance[]> {
    this.isFetchingActivities = true;

    return this._userActivites.getActivities(of(this.studyGuid)).pipe(
      tap(activities => {
        this.isFetchingActivities = false;

        // eslint-disable-next-line curly
        if (!activities) return;

        this.activities = activities;

        const demographicsActivity = activities.find(
          activity =>
            activity.activityCode === ActivityCodes.GeneralInformation,
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
