import { Invitation } from './invitation';

export interface StudySubject extends Invitation {
    userGuid: string | null;
    userLoginEmail: string | null;
    notes: string | null;
}
