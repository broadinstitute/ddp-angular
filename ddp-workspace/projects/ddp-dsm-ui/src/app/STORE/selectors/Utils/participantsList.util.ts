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
    activities: pt.esData.activities.map(activity => ({
      activityName: Object.values(actDefs).find(actDef => actDef['activityCode'] === activity.activityCode)['activityName'],
      activityGuid: activity.guid
    }))
  })) : [];
};
