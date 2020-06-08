export interface StudySubject {
    invitationId: string;
    createdAt: string;
    voidedAt: string | null;
    verifiedAt: string | null;
    acceptedAt: string | null;
    userGuid: string | null;
    userHruid: string | null;
    userLoginEmail: string | null;
    notes: string | null;
}
