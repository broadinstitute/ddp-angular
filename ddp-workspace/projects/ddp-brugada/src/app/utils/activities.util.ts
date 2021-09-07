import { ActivityStatusCodes, ActivityInstance } from 'ddp-sdk';

export const sortActivitiesByStatus = (activities: ActivityInstance[]): ActivityInstance[] => {
  const inprogressActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode === ActivityStatusCodes.IN_PROGRESS,
  );

  const completedActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode === ActivityStatusCodes.COMPLETE,
  );

  const createdActivities: ActivityInstance[] = activities.filter(
    (activity: ActivityInstance) => activity.statusCode === ActivityStatusCodes.CREATED,
  );

  return [...inprogressActivities, ...createdActivities, ...completedActivities];
};
