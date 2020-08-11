import { UserProfile } from './userProfile';

export class UserProfileDecorator {
    public newProfile: boolean;
    public profile: UserProfile;

    constructor(existingProfile: any | null = null) {
        this.newProfile = existingProfile == null;
        if (existingProfile) {
            this.profile = new UserProfile();
            this.profile.birthYear = existingProfile.birthYear;
            this.profile.birthMonth = existingProfile.birthMonth;
            this.profile.birthDayInMonth = existingProfile.birthDayInMonth;
            this.profile.sex = existingProfile.sex;
            this.profile.preferredLanguage = existingProfile.preferredLanguage;
            this.profile.firstName = existingProfile.firstName;
            this.profile.lastName = existingProfile.lastName;
        } else {
            this.profile = new UserProfile();
        }
    }
}
