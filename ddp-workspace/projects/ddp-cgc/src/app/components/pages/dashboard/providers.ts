import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
import { InjectionToken, Provider } from '@angular/core';
import { ActivityCode } from './../../../constants/activity-code';
import { ActivitiesStoreService } from './../../../services/activities-store.service';
import { ActivityInstance, ConfigurationService, ActivityServiceAgent, ActivityForm } from 'ddp-sdk';
import { getReleaseRequestTitle, SimpleActivityQuestionBlock } from './../../../util/activities.util';


export const ACTIVITIES: InjectionToken<Observable<ActivityInstance[]>> = new InjectionToken<Observable<ActivityInstance[]>>(
  'A stream with activities'
);

export const activitiesProvider: Provider = {
  provide: ACTIVITIES,
  useFactory: (activitiesStoreService: ActivitiesStoreService) => activitiesStoreService.activities$.pipe(
    map((activities: ActivityInstance[]) => activities.filter(
      ({ activityCode }: ActivityInstance) => activityCode !== ActivityCode.ReleaseRequestClinical
                                           && activityCode !== ActivityCode.ReleaseRequestGenetic
    ))
  ),
  deps: [ActivitiesStoreService]
};

export const RELEASE_REQUESTS: InjectionToken<Observable<ActivityInstance[]>> = new InjectionToken<Observable<ActivityInstance[]>>(
  'A stream with release requests'
);

export const releaseRequestsProvider: Provider = {
  provide: RELEASE_REQUESTS,
  useFactory: (
    activitiesStoreService: ActivitiesStoreService,
    activityServiceAgent: ActivityServiceAgent,
    config: ConfigurationService
  ) => activitiesStoreService.activities$.pipe(
    map((activities: ActivityInstance[]) => activities.filter(
        ({ activityCode }: ActivityInstance) => activityCode === ActivityCode.ReleaseRequestClinical
                                             || activityCode === ActivityCode.ReleaseRequestGenetic
      )
    ),
    switchMap((releaseRequestsActivities: ActivityInstance[]) => releaseRequestsActivities.length
      ? combineLatest(
          releaseRequestsActivities.map(
            (activity: ActivityInstance) => activityServiceAgent.getActivity(
              of(config.studyGuid),
              of(activity.instanceGuid)
            )
          )
        ).pipe(
          map((releaseRequestsActivityForms: ActivityForm[]) => releaseRequestsActivityForms.map(
            (releaseRequestsActivityForm: ActivityForm, i: number) => ({
              ...releaseRequestsActivities[i],
              activityTitle: getReleaseRequestTitle(
                releaseRequestsActivities[i],
                releaseRequestsActivityForm.sections[0].blocks as unknown as SimpleActivityQuestionBlock[]
              )
            })
          ))
        )
      : of([])
    )
  ),
  deps: [ActivitiesStoreService, ActivityServiceAgent, 'ddp.config']
};
