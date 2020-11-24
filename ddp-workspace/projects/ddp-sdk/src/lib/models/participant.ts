import { UserProfile } from './userProfile';

export interface Participant {
    alias: string;
    userGuid: string;
    userProfile: UserProfile;
}
