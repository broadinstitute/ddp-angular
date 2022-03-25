import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';
import { omit } from 'underscore';

import { ActivityCode } from '../constants/activity-code';
import { RenderActivity, RenderActivityKey } from './types';


export const isConsentActivity = (activityCode: string): boolean => (
    activityCode === ActivityCode.ConsentSelf ||
    activityCode === ActivityCode.ConsentAssent ||
    activityCode === ActivityCode.ConsentParental
  );


const getRenderActivityKeyByActivityCode = (activityCode: ActivityCode): RenderActivityKey => {
  if ([ActivityCode.ConsentSelf, ActivityCode.ConsentParental, ActivityCode.ConsentAssent].includes(activityCode)) {
    return RenderActivityKey.Consent;
  }

  if ([ActivityCode.AboutPatient, ActivityCode.AboutHealthy].includes(activityCode)) {
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

  let renderActivitiesMap: Record<string, RenderActivity> = {
    [RenderActivityKey.Consent]: {
      i18nKey: 'Consent',
    },
    [RenderActivityKey.About]: {
      i18nKey: null,
    },
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

  const isSelf = activities.some(a => a.activityCode === ActivityCode.AddParticipantSelf);

  renderActivitiesMap[RenderActivityKey.About] = {
    i18nKey: isSelf ? 'AboutMe' : 'AboutMyChild',
  };

  /**
   * Branching: "Healthy" & "Patient"
   */
  const aboutActivity = activities.find(a =>
    [ActivityCode.AboutHealthy, ActivityCode.AboutPatient].includes(a.activityCode as ActivityCode),
  );
  const hasAboutActivity = !!aboutActivity;

  if (hasAboutActivity) {
    if (aboutActivity.activityCode === ActivityCode.AboutHealthy) {
      /**
       * On "Healthy" branch - omit any activities after "About" survey
       */
      renderActivitiesMap = omit(renderActivitiesMap, [
        RenderActivityKey.MedicalReleaseForm,
        RenderActivityKey.MedicalRecordUpload,
        RenderActivityKey.PatientSurvey,
      ]);
    }
  }

  /**
   * Find which activity is participant currently on
   */
  if (instanceGuid) {
    const activity = activities.find(a => a.instanceGuid === instanceGuid);
    const renderKey = getRenderActivityKeyByActivityCode(activity.activityCode as ActivityCode);

    renderActivitiesMap[renderKey].isCurrent = true;
  }

  /**
   * Mark other activities as complete
   */
  activities.forEach(a => {
    /**
     * Skip "Add Participant" activity
     */
    if (
      [ActivityCode.AddParticipantSelf, ActivityCode.AddParticipantParental].includes(a.activityCode as ActivityCode)
    ) {
      return;
    }

    if (a.statusCode === ActivityStatusCodes.COMPLETE || !!a.previousInstanceGuid) {
      const renderKey = getRenderActivityKeyByActivityCode(a.activityCode as ActivityCode);

      if (renderActivitiesMap[renderKey]) {
        renderActivitiesMap[renderKey].isComplete = true;
      }
    }
  });

  return Object.values(renderActivitiesMap);
};
