import { ActivityCode } from './activity-code';


export interface ActivityListItem {
  activityCode: string;
  activityNameI18nKey: string;
}

export const activitiesList: ActivityListItem[] = [
  { activityCode: ActivityCode.Consent, activityNameI18nKey: 'App.ProgressBar.Titles.Consent' },
  { activityCode: ActivityCode.MedicalRecordRelease, activityNameI18nKey: 'App.ProgressBar.Titles.MedicalRecordRelease' },
  { activityCode: ActivityCode.BackgroundInformation, activityNameI18nKey: 'App.ProgressBar.Titles.BackgroundInformation' },
  { activityCode: ActivityCode.GeneticTesting, activityNameI18nKey: 'App.ProgressBar.Titles.GeneticTesting' },
  { activityCode: null, activityNameI18nKey: 'App.ProgressBar.Titles.Other' },
];
