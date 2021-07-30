import { Router } from '@angular/router';
import { Route } from '../../../constants/route';
import { Inject, Injectable } from '@angular/core';
import { filter, first, tap } from 'rxjs/operators';
import { ActivityCode } from '../../../constants/activity-code';
import { ConfigurationService, ActivityServiceAgent, ActivityInstanceGuid } from 'ddp-sdk';


@Injectable()
export class DashboardFacade {
  constructor(
    private readonly router: Router,
    private readonly activityServiceAgent: ActivityServiceAgent,
    @Inject('ddp.config') private readonly config: ConfigurationService,
  ) {}

  startActivity(instanceGuid: string): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  continueActivity(instanceGuid: string): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  viewActivity(instanceGuid: string): void {
    this.router.navigate([Route.Activity, instanceGuid]);
  }

  startNewReleaseRequest(code: ActivityCode): void {
    this.activityServiceAgent.createInstance(this.config.studyGuid, code).pipe(
      filter((activityInstanceGuid: ActivityInstanceGuid) => !!activityInstanceGuid),
      tap(({ instanceGuid }: ActivityInstanceGuid) => this.router.navigate([Route.Activity, instanceGuid])),
      first()
    ).subscribe();
  }
}
