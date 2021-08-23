import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InjectionToken, Provider } from '@angular/core';
import { filter, first, map, pluck, switchMap } from 'rxjs/operators';
import { ConfigurationService, UserActivityServiceAgent, ActivityInstance } from 'ddp-sdk';


export const ACTIVE_ACTIVITY_NUMBER: InjectionToken<Observable<number>> = new InjectionToken<Observable<number>>(
  'A stream with a number of active activity'
);

export const activeActivityNumberProvider: Provider = {
  provide: ACTIVE_ACTIVITY_NUMBER,
  useFactory: (
    route: ActivatedRoute,
    config: ConfigurationService,
    userActivityService: UserActivityServiceAgent,
  ) => route.params.pipe(
    pluck('id'),
    filter((activeActivityId: string) => !!activeActivityId),
    switchMap((activeActivityId: string) => userActivityService.getActivities(of(config.studyGuid)).pipe(
      first(),
      map((activities: ActivityInstance[]) => activities.indexOf(
        activities.find(
          (activity: ActivityInstance) => activity.instanceGuid === activeActivityId
        )
      ))
    ))
  ),
  deps: [ActivatedRoute, 'ddp.config', UserActivityServiceAgent]
};
