import { ActivityCode } from '../constants/activity-code';

export const isConsentActivity = (activityCode: string): boolean => (
    activityCode === ActivityCode.ConsentSelf ||
    activityCode === ActivityCode.ConsentAssent ||
    activityCode === ActivityCode.ConsentParental
  );
