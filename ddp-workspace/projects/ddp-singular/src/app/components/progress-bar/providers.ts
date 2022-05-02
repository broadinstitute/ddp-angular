import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InjectionToken, Provider } from '@angular/core';
import { ActivityCode } from '../../constants/activity-code';
import { filter, first, map, pluck, switchMap } from 'rxjs/operators';
import { ActivityListItem } from '../../interfaces/activity-list-item';
import { ActivityInstance, ActivityStatusCodes, ConfigurationService, UserActivityServiceAgent } from 'ddp-sdk';


const getUpdatedActivityMap = (activities: ActivityInstance[], activeActivityId: string): Map<string, ActivityListItem> => {
  const consentActivityCodes = [ActivityCode.ConsentSelf, ActivityCode.ConsentParental, ActivityCode.ConsentDependent];
  const consentActivity = activities.find(
    (activity: ActivityInstance) => consentActivityCodes.includes(activity.activityCode)
  );

  const consentKey: ActivityCode = consentActivity.activityCode;
  let aboutDisplayName: string = null;

  switch (consentKey) {
    case ActivityCode.ConsentSelf: {
        aboutDisplayName = 'ProgressBar.Titles.AboutMe';
        break;
    }
    case ActivityCode.ConsentParental: {
        aboutDisplayName = 'ProgressBar.Titles.AboutMyChild';
        break;
    }
    case ActivityCode.ConsentDependent: {
        aboutDisplayName = 'ProgressBar.Titles.AboutMyDependent';
        break;
    }
    default: {
        aboutDisplayName = 'UNKNOWN';
    }
  }

  const activitiesDictionary: Map<string, ActivityListItem> = new Map(
    Object.entries({
      [consentKey]: { activityNameI18nKey: 'ProgressBar.Titles.Consent' },
      [ActivityCode.AboutPatient]: { activityNameI18nKey: aboutDisplayName },
      [ActivityCode.MedicalRecordRelease]: { activityNameI18nKey: 'ProgressBar.Titles.MedicalRecordRelease' },
      [ActivityCode.MedicalRecordFileUpload]: { activityNameI18nKey: 'ProgressBar.Titles.MedicalRecordFileUpload' },
      [ActivityCode.PatientSurvey]: { activityNameI18nKey: 'ProgressBar.Titles.PatientSurvey' },
    })
  );

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
      if (activityItem.instanceGuid === activeActivityId && activitiesDictionary.has(activityItem.activityCode)) {
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
