import { ActivityCode } from './activity-code';


export interface ActivityListItem {
  activityCode: string;
  activityName: string;
}

export const activitiesList: ActivityListItem[] = [
  { activityCode: ActivityCode.Consent, activityName: 'Consent form' },
  { activityCode: ActivityCode.MedicalRecordRelease, activityName: 'Medical Record Release Form' },
  { activityCode: ActivityCode.BackgroundInformation, activityName: 'Background Information Survey' },
  { activityCode: ActivityCode.GeneticTesting, activityName: 'Genetic Testing & Family History Survey' },
  { activityCode: null, activityName: 'Additional surveys' },
];
