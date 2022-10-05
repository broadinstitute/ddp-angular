import { getRenderActivities } from './helpers';
import { ActivityCode } from '../constants/activity-code';
import { ActivityInstance, ActivityStatusCodes } from 'ddp-sdk';

describe('Singular utils helpers', () => {
  it('getRenderActivities should return null for 1 activity only', () => {
    const activities = [{activityCode: 'Add Participant'}] as ActivityInstance[];
    expect(getRenderActivities(null, activities)).toBeNull();
  });

  it('getRenderActivities: should return render activities for a child', () => {
    const activities = [
      {activityCode: ActivityCode.ConsentParental},
      {activityCode: ActivityCode.ChildContact}
    ] as ActivityInstance[];

    expect(getRenderActivities(null, activities)).toEqual([
      {i18nKey: 'Consent'},
      {i18nKey: 'AboutMyChild'},
      {i18nKey: 'MedicalReleaseForm'},
      {i18nKey: 'MedicalRecordUpload'},
      {i18nKey: 'PatientSurvey'}
    ]);
  });

  it('getRenderActivities: should return render activities for an aged up case', () => {
    const activities = [
      {activityCode: ActivityCode.ConsentParental},
      {activityCode: ActivityCode.ConsentSelf}
    ] as ActivityInstance[];

    expect(getRenderActivities(null, activities)).toEqual([
      {i18nKey: 'Consent'},
      {i18nKey: 'AboutMe'},
      {i18nKey: 'MedicalReleaseForm'},
      {i18nKey: 'MedicalRecordUpload'},
      {i18nKey: 'PatientSurvey'}
    ]);
  });

  it('getRenderActivities: should return render activities for an adult', () => {
    const activities = [
      {activityCode: ActivityCode.ConsentSelf},
      {activityCode: ActivityCode.ChildContact}
    ] as ActivityInstance[];

    expect(getRenderActivities(null, activities)).toEqual([
      {i18nKey: 'Consent'},
      {i18nKey: 'AboutMe'},
      {i18nKey: 'MedicalReleaseForm'},
      {i18nKey: 'MedicalRecordUpload'},
      {i18nKey: 'PatientSurvey'}
    ]);
  });

  it('getRenderActivities: should return render activities for Healthy branch', () => {
    const activities = [
      {activityCode: ActivityCode.ConsentSelf},
      {activityCode: ActivityCode.AboutHealthy}
    ] as ActivityInstance[];

    expect(getRenderActivities(null, activities)).toEqual([
      {i18nKey: 'Consent'},
      {i18nKey: 'AboutMe'}
    ]);
  });

  it('getRenderActivities: should set the current activity', () => {
    const activities = [
      {activityCode: ActivityCode.ConsentSelf, instanceGuid: 'AABBCC'},
      {activityCode: ActivityCode.ChildContact, instanceGuid: 'XXYYZZ'}
    ] as ActivityInstance[];

    expect(getRenderActivities('AABBCC', activities)).toEqual([
      {i18nKey: 'Consent', isCurrent: true},
      {i18nKey: 'AboutMe'},
      {i18nKey: 'MedicalReleaseForm'},
      {i18nKey: 'MedicalRecordUpload'},
      {i18nKey: 'PatientSurvey'}
    ]);
  });

  it('getRenderActivities: should set complete status for activities', () => {
    const activities = [
      {activityCode: ActivityCode.AddParticipantSelf},
      {activityCode: ActivityCode.ConsentSelf, statusCode: ActivityStatusCodes.COMPLETE},
      {activityCode: ActivityCode.AboutPatient, previousInstanceGuid: 'someId'},
      {activityCode: ActivityCode.PatientSurvey, instanceGuid: 'instanceGuid'}
    ] as ActivityInstance[];

    expect(getRenderActivities('instanceGuid', activities)).toEqual([
      {i18nKey: 'Consent', isComplete: true},
      {i18nKey: 'AboutMe', isComplete: true},
      {i18nKey: 'MedicalReleaseForm'},
      {i18nKey: 'MedicalRecordUpload'},
      {i18nKey: 'PatientSurvey', isCurrent: true}
    ]);
  });
});
