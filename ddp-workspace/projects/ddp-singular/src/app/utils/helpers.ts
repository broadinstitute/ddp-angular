import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

import { ActivityCode } from '../constants/activity-code';
import { RenderActivity, RenderActivityKey } from './types';


export const isConsentActivity = (activityCode: string): boolean => (
    activityCode === ActivityCode.ConsentSelf ||
    activityCode === ActivityCode.ConsentAssent ||
    activityCode === ActivityCode.ConsentParental ||
    activityCode === ActivityCode.ConsentDependent
  );

export const isMedicalRecordReleaseActivity = (activityCode: string): boolean =>
  activityCode === ActivityCode.MedicalRecordRelease;


const getRenderActivityKeyByActivityCode = (activityCode: ActivityCode): RenderActivityKey => {
  if ([ActivityCode.ConsentSelf,
       ActivityCode.ConsentParental,
       ActivityCode.ConsentAssent,
       ActivityCode.ConsentDependent].includes(activityCode)) {
    return RenderActivityKey.Consent;
  }

  if ([ActivityCode.AboutPatient, ActivityCode.AboutHealthy, ActivityCode.ChildContact].includes(activityCode)) {
    return RenderActivityKey.About;
  }

  switch (activityCode) {
    case ActivityCode.MedicalRecordRelease:
      return RenderActivityKey.MedicalReleaseForm;
    case ActivityCode.MedicalRecordFileUpload:
      return RenderActivityKey.MedicalRecordUpload;
    case ActivityCode.PatientSurvey:
      return RenderActivityKey.PatientSurvey;
    default:
      throw new Error(`Unknown "${activityCode} activity code"`);
  }
};


export const getRenderActivities = (instanceGuid: string, activities: ActivityInstance[]): RenderActivity[] => {
  if (activities.length === 1) {
    /**
     * We're on "Add Participant" activity -- do nothing
     */
    return null;
  }

  const isChild = activities.some(a => a.activityCode === ActivityCode.ConsentParental)
    && !activities.some(a => a.activityCode === ActivityCode.ConsentSelf);

  const isHealthyBranch = activities.some(a => a.activityCode === ActivityCode.AboutHealthy);

  const renderActivitiesMap: Record<string, RenderActivity> = getRenderActivitiesMap(isChild, isHealthyBranch);

  const updatedRenderActivitiesMap =  activities.reduce((acc: {[key: string]: RenderActivity}, activity: ActivityInstance) => {
    /** Find which activity is participant currently on */
    if (activity.instanceGuid === instanceGuid) {
      const renderKey = getRenderActivityKeyByActivityCode(activity.activityCode as ActivityCode);
      acc[renderKey].isCurrent = true;
    }

    /** Mark other activities as complete */
    const isAddParticipantActivity = [
      ActivityCode.AddParticipantSelf,
      ActivityCode.AddParticipantParental,
      ActivityCode.AddParticipantDependent
    ].includes(activity.activityCode as ActivityCode);

    if (!isAddParticipantActivity
      && (activity.statusCode === ActivityStatusCodes.COMPLETE || !!activity.previousInstanceGuid)
    ) {
      const renderKey = getRenderActivityKeyByActivityCode(activity.activityCode as ActivityCode);
      acc[renderKey].isComplete = true;
    }

    return acc;
  }, renderActivitiesMap);

  return Object.values(updatedRenderActivitiesMap);
};


function getRenderActivitiesMap(isChild: boolean, isHealthyBranch: boolean): Record<string, RenderActivity> {
  const basicActivitiesMap = {
    [RenderActivityKey.Consent]: {
      i18nKey: 'Consent',
    },
    [RenderActivityKey.About]: {
      i18nKey: isChild ? 'AboutMyChild' : 'AboutMe',
    }
  };

  const additionalActivitiesMap: Record<string, RenderActivity> = {
    [RenderActivityKey.MedicalReleaseForm]: {
      i18nKey: 'MedicalReleaseForm',
    },
    [RenderActivityKey.MedicalRecordUpload]: {
      i18nKey: 'MedicalRecordUpload',
    },
    [RenderActivityKey.PatientSurvey]: {
      i18nKey: 'PatientSurvey',
    },
  };

  return isHealthyBranch ?
    basicActivitiesMap   /** On "Healthy" branch - omit any activities after "About" survey, only basic ones */
    : {...basicActivitiesMap, ...additionalActivitiesMap};
}
