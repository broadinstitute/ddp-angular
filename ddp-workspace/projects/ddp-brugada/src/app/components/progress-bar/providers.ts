import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InjectionToken, Provider } from '@angular/core';
import { ActivityCode } from '../../constants/activity-code';
import { filter, first, map, pluck, switchMap } from 'rxjs/operators';
import { ActivityListItem } from '../../interfaces/activity-list-item';
import { ConfigurationService, UserActivityServiceAgent, ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';


const anotherKey = 'another';
const ADDITIONAL_SURVEYS_COUNT = 1;

const getUpdatedActivityMap = (activities: ActivityInstance[], activeActivityId: string): Map<string, ActivityListItem> => {
  const activitiesDictionary: Map<string, ActivityListItem> = new Map(
    Object.entries({
      [ActivityCode.Consent]: { activityNameI18nKey: 'App.ProgressBar.Titles.Consent' },
      [ActivityCode.MedicalRecordRelease]: { activityNameI18nKey: 'App.ProgressBar.Titles.MedicalRecordRelease' },
      [ActivityCode.BackgroundInformation]: { activityNameI18nKey: 'App.ProgressBar.Titles.BackgroundInformation' },
      [ActivityCode.GeneticTesting]: { activityNameI18nKey: 'App.ProgressBar.Titles.GeneticTesting' },
      [anotherKey]: { activityNameI18nKey: 'App.ProgressBar.Titles.Other' },
    })
  );

  const isCurentActivityAdditional = !activitiesDictionary.has(
    activities
      .find(
        (activity: ActivityInstance) => activity.instanceGuid === activeActivityId
      )
      ?.activityCode
  );

  const isAdditionalActivitiesComplete: boolean = activities
      .filter(
        (activity: ActivityInstance) => !activitiesDictionary.has(activity.activityCode)
                                      && (activity.statusCode === ActivityStatusCodes.COMPLETE
                                      || activity.statusCode === ActivityStatusCodes.CREATED && activity.previousInstanceGuid)
      )
      .length === ADDITIONAL_SURVEYS_COUNT;

  if (isAdditionalActivitiesComplete) {
    activitiesDictionary.set(
      anotherKey,
      {
        ...activitiesDictionary.get(anotherKey),
        status: ActivityStatusCodes.COMPLETE
      }
    );
  }

  if (isCurentActivityAdditional) {
    activitiesDictionary.set(
      anotherKey,
      {
        ...activitiesDictionary.get(anotherKey),
        status: ActivityStatusCodes.IN_PROGRESS
      }
    );
  }

  activities.forEach(
    (activityItem: ActivityInstance) => {
      if (activitiesDictionary.has(activityItem.activityCode) && activityItem.statusCode === ActivityStatusCodes.COMPLETE
       || activitiesDictionary.has(activityItem.activityCode)
            && activityItem.previousInstanceGuid
            && activityItem.statusCode === ActivityStatusCodes.CREATED
      ) {
        activitiesDictionary.set(
          activityItem.activityCode,
          {
            ...activitiesDictionary.get(activityItem.activityCode),
            status: ActivityStatusCodes.COMPLETE
          }
        );
      }
      if (activityItem.instanceGuid === activeActivityId
       && activitiesDictionary.has(activityItem.activityCode)
       && !isCurentActivityAdditional
      ) {
        activitiesDictionary.set(
          activityItem.activityCode,
          {
            ...activitiesDictionary.get(activityItem.activityCode),
            status: ActivityStatusCodes.IN_PROGRESS
          }
        );
      }
    }
  );

  return activitiesDictionary;
};

export const ACTIVITIES: InjectionToken<Observable<ActivityInstance[]>> = new InjectionToken<Observable<ActivityInstance[]>>(
  'A stream with activities for progress bar'
);

export const activeActivityNumberProvider: Provider = {
  provide: ACTIVITIES,
  useFactory: (
    route: ActivatedRoute,
    config: ConfigurationService,
    userActivityService: UserActivityServiceAgent,
  ) => route.params.pipe(
    pluck('id'),
    filter((activeActivityId: string) => !!activeActivityId),
    switchMap((activeActivityId: string) => userActivityService.getActivities(of(config.studyGuid)).pipe(
      first(),
      map((activities: ActivityInstance[]) => getUpdatedActivityMap(activities, activeActivityId))
    )),
    map((activitiesDictionary: Map<string, ActivityListItem>) => Array
      .from(activitiesDictionary)
      .map(
        ([activityCode, value]: [string, ActivityListItem]) => ({
          ...value,
          activityCode
        })
      )
    )
  ),
  deps: [ActivatedRoute, 'ddp.config', UserActivityServiceAgent]
};
