import { ActivityCode } from '../types';

export const isAboutYouOrChildActivity = (activityCode: string): boolean =>
    activityCode === ActivityCode.AboutYouOrChild;
