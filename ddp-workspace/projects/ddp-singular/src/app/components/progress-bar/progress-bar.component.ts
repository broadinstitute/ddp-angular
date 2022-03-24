import { Component, Input } from '@angular/core';
import { omit } from 'underscore';

import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

import { ActivityCode } from '../../constants/activity-code';

interface RenderActivity {
  i18nKey: string | null;
  isCurrent?: boolean;
  isComplete?: boolean;
}

enum RenderActivityKey {
  Consent = 'CONSENT',
  About = 'ABOUT',
  MedicalReleaseForm = 'MEDICAL_RELEASE_FORM',
  MedicalRecordUpload = 'MEDICAL_RECORD_UPLOAD',
  PatientSurvey = 'PATIENT_SURVEY',
}

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

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  renderActivities: RenderActivity[] | null = null;
  @Input() instanceGuid: string | null = null;
  @Input() hidden = false;

  @Input() set activities(activities: ActivityInstance[]) {
    if (activities) {
      this.renderActivities = this.getRenderActivities(activities);
    }
  }

  get isProgressBarDisplayed(): boolean {
    return this.renderActivities !== null && !this.hidden;
  }

  private getRenderActivities(activities: ActivityInstance[]): RenderActivity[] {
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
    if (this.instanceGuid) {
      const activity = activities.find(a => a.instanceGuid === this.instanceGuid);
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
  }
}
