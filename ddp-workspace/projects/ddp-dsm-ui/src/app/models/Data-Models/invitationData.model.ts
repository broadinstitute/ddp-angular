export interface InvitationDataModel {
  acceptedAt: number;
  createdAt: number;
  verifiedAt: number;
  voidedAt: number;
  notes: string;
  contactEmail: string;
  guid: string;
  type: string;
}
