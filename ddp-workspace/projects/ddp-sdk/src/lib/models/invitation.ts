import { InvitationType } from './invitationType';

export interface Invitation {
    invitationType: InvitationType;
    invitationId: string;
    createdAt: string;
    voidedAt: string | null;
    verifiedAt: string | null;
    acceptedAt: string | null;
    notes: string | null;
}
