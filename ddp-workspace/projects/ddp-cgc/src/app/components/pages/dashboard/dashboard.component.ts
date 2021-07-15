import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Route } from '../../../constants/route';
import { filter, first, tap } from 'rxjs/operators';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivityCode } from '../../../constants/activity-code';
import { ActivityStatusCode } from './../../../../../../ddp-rgp/src/app/constants/activity-status-code';
import { ActivityInstance, UserActivityServiceAgent, ConfigurationService, ActivityServiceAgent, ActivityInstanceGuid } from 'ddp-sdk';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = true;
  showReleaseRequests = false;
  activities: ActivityInstance[] = [];
  releaseRequests: ActivityInstance[] = [];

  constructor(
    private readonly router: Router,
    private readonly activityServiceAgent: ActivityServiceAgent,
    private readonly userActivityService: UserActivityServiceAgent,
    @Inject('ddp.config') private readonly config: ConfigurationService,
  ) {}

  ngOnInit(): void {
    this.fetchActivities();
  }

  onStartActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onContinueActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onViewActivity(activity: ActivityInstance): void {
    this.router.navigate([Route.Activity, activity.instanceGuid]);
  }

  onStartNewReleaseRequest(code: ActivityCode): void {
    this.activityServiceAgent.createInstance(this.config.studyGuid, code).pipe(
      filter((activityInstanceGuid: ActivityInstanceGuid) => !!activityInstanceGuid),
      tap(({ instanceGuid }: ActivityInstanceGuid) => this.router.navigate([Route.Activity, instanceGuid]))
    ).subscribe();
  }

  private fetchActivities(): void {
    this.loading = true;

    this.userActivityService
      .getActivities(of(this.config.studyGuid))
      .pipe(
        first()
      )
      .subscribe(activities => {
        this.showReleaseRequests = !!activities.find(
          ({ activityCode, statusCode }: ActivityInstance) => activityCode === ActivityCode.Consent
                                                           && statusCode === ActivityStatusCode.Complete
        );

        this.activities = activities.filter(
          ({ activityCode }: ActivityInstance) => activityCode !== ActivityCode.ReleaseRequestClinical
                                               && activityCode !== ActivityCode.ReleaseRequestGenetic
        );

        this.releaseRequests = activities.filter(
          ({ activityCode }: ActivityInstance) => activityCode === ActivityCode.ReleaseRequestClinical
                                               || activityCode === ActivityCode.ReleaseRequestGenetic
        );

        this.loading = false;
      });
  }
}
