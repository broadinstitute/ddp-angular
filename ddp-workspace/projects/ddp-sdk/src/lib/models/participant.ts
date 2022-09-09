import { ActivityInstance } from './activityInstance';
import { UserProfile } from './userProfile';

export interface Participant {
    alias: string;
    userGuid: string;
    userProfile: UserProfile;
}
export interface DashboardParticipant {
    firstName?: string;
    lastName?: string;
    guid: string;
    activities: ActivityInstance[];
    isOperator?: boolean;
    label?: string;
  }