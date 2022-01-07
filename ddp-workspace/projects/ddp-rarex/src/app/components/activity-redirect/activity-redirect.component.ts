import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  UserActivityServiceAgent,
  CompositeDisposable,
  ActivityInstance,
} from 'ddp-sdk';

import { ToolkitConfigurationService } from 'toolkit';

import { CurrentActivityService } from '../../services/current-activity.service';
import { RoutePaths } from '../../router-resources';

@Component({
  selector: 'app-activity-redirect',
  template: '',
})
export class ActivityRedirectComponent implements OnInit, OnDestroy {
  private _anchor = new CompositeDisposable();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userActivityServiceAgent: UserActivityServiceAgent,
    private _currentActivity: CurrentActivityService,
    @Inject('toolkit.toolkitConfig')
    private _toolkitConfiguration: ToolkitConfigurationService,
  ) {}

  ngOnInit(): void {
    const instanceGuid = this._route.snapshot.params.instanceGuid;
    const activityCode = this._route.snapshot.data.activityCode;

    let getActivities$: Observable<any> = this._userActivityServiceAgent.getActivities(
      of(this._toolkitConfiguration.studyGuid),
    );

    if (instanceGuid) {
      getActivities$ = getActivities$.pipe(
        // eslint-disable-next-line arrow-body-style
        map(activities => {
          return activities
            ? activities.find(
                activity => activity.instanceGuid === instanceGuid,
              )
            : null;
        }),
      );
    }

    if (activityCode) {
      getActivities$ = getActivities$.pipe(
        // eslint-disable-next-line arrow-body-style
        map(activities => {
          return activities
            ? activities.find(
                activity => activity.activityCode === activityCode,
              )
            : null;
        }),
      );
    }

    if (instanceGuid || activityCode) {
      this._anchor.addNew(
        getActivities$.subscribe((activityInstance?: ActivityInstance) => {
          if (activityInstance) {
            this._currentActivity.activity$.next({
              instance: activityInstance,
              isReadonly: false,
            });
            this._router.navigateByUrl(RoutePaths.Survey);
          } else {
            this._currentActivity.activity$.next(null);
            this._router.navigateByUrl(RoutePaths.Dashboard);
          }
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this._anchor.removeAll();
  }
}
