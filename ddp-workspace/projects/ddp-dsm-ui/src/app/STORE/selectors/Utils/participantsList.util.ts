import {ParticipantModel} from '../../models/participant.model';

export const generateParticipantsList = (participants: ParticipantModel[], settings: any): Array<any> => {
  const actDefs = settings?.activityDefinitions;

  return participants instanceof Array && actDefs ? participants.map(pt => ({
    ID: pt.esData.profile.hruid,
    guid: pt.esData.profile.guid,
    firstName: pt.esData.profile.firstName,
    lastName: pt.esData.profile.lastName,
    birthdate: '01/01/2022',
    registered: '02/02/2002',
    lastUpdated: '01/01/2022',
    activities: pt.esData.activities.map(activity => {
      const activityGot = Object.values(actDefs).find(actDef => actDef['activityCode'] === activity.activityCode);
      return {
        name: activityGot['activityName'],
        activityGuid: activity.guid,
        activityCode: activityGot['activityCode']
      };
    })
  })) : [];
};

export const generateGroupedActivities = (patient: any): any => {
  if(patient?.activities) {
    const groupedActivities = {
      ENROLLMENT_FORMS: {name: 'ENROLLMENT FORMS', activities: []},
      TESTING_LOGS_EVENTS: {name: 'TESTING, LOGS & EVENTS', activities: []},
      PROMISE_QUESTIONNAIRE: {name: 'PROMISE QUESTIONNAIRE', activities: []},
      PATIENT_STATUS: {name: 'PATIENT STATUS', activities: []}
    };
    patient?.activities?.forEach(({activityCode, activityGuid, name}) => {
      const foundActivity = groupedActivitiesMap.find(actItem => actItem.activityCode === activityCode);
      foundActivity && groupedActivities[foundActivity.sectionGuid].activities.push({name,activityGuid,...foundActivity});
    });
    patient.activities = groupedActivities;
    return patient;
  }
  return;
};

const groupedActivitiesMap = [
  {name: 'Patient Information', sectionGuid: 'ENROLLMENT_FORMS', activityCode: 'PATIENT_PROFILE'},
  {name: 'Enrollment', sectionGuid: 'ENROLLMENT_FORMS', activityCode: 'ENROLLMENT'},
  {name: 'Clinic Visits', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'CLINIC_VISIT'},
  {name: 'Labs', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'LABS'},
  {name: 'Medication Log', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'MEDICATION_LOG'},
  {name: 'Medication Log', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'MEDICATION_LOG_CHILD'},
  {name: 'Surgical Log', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'SURGICAL_LOG'},
  {name: 'Surgical Log', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'SURGICAL_LOG_CHILD'},
  {name: 'Hospitalization', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'HOSPITALIZATION'},
  {name: 'Heart failure', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'HEART_FAILURE'},
  {name: 'Pregnancy & Birth', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'PREGNANCY_PROGENY'},
  {name: 'Clinical Administered Questions', sectionGuid: 'TESTING_LOGS_EVENTS', activityCode: 'CLINIC_ADMIN_QUESTIONS'},
  {name: 'PROMIS Adult', sectionGuid: 'PROMISE_QUESTIONNAIRE', activityCode: 'PROMIS_ADULT'},
  {name: 'PROMIS Pediatric', sectionGuid: 'PROMISE_QUESTIONNAIRE', activityCode: 'PROMIS_PEDIATRIC'},
  {name: 'PROMIS Proxy', sectionGuid: 'PROMISE_QUESTIONNAIRE', activityCode: 'PROMIS_PROXY'},
  {name: 'Patient Status', sectionGuid: 'PATIENT_STATUS', activityCode: 'PATIENT_STATUS'}
];

