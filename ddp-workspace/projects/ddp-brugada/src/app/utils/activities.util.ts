import { ActivityStatusCodes } from 'ddp-sdk';
import { ActivityInstance } from './../../../../ddp-sdk/src/lib/models/activityInstance';


export const sortActivitiesByStatus = (activities: ActivityInstance[]): ActivityInstance[] => {
  const inprogressActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode === ActivityStatusCodes.IN_PROGRESS
  );

  const completedActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode === ActivityStatusCodes.COMPLETE
  );

  const incompletedActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode !== ActivityStatusCodes.COMPLETE
  );

  return [...inprogressActivities, ...incompletedActivities, ...completedActivities];
};
