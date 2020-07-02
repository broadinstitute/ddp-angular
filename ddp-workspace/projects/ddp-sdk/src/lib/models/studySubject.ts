import { Invitation } from './invitation';

export interface StudySubject extends Invitation {
    userGuid: string | null;
    userHruid: string | null;
    userLoginEmail: string | null;
    notes: string | null;
}
