import { ActivityStatusCodes } from 'ddp-sdk';
import { ActivityInstance } from './../../../../ddp-sdk/src/lib/models/activityInstance';


export const sortActivitiesByStatus = (activities: ActivityInstance[]): ActivityInstance[] => {
  const completedActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode === ActivityStatusCodes.COMPLETE
  );

  const incompletedActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode !== ActivityStatusCodes.COMPLETE
  );

  return [...incompletedActivities, ...completedActivities];
};
