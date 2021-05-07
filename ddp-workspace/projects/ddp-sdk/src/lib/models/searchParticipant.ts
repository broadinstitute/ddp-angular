import { EnrollmentStatusType } from './enrollmentStatusType';

interface SearchParticipantBase {
    guid: string;
    hruid: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    legacyAltPid?: string;
    legacyShortId?: string;
}

export interface SearchParticipant extends SearchParticipantBase {
    status: EnrollmentStatusType;
    invitationId?: string;
    proxy?: SearchParticipantBase;
}

export interface SearchParticipantResponse {
    totalCount: number;
    results: SearchParticipant[];
}
