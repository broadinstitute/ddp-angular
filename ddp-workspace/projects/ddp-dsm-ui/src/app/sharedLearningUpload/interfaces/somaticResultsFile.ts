export interface SomaticResultsFile {
  blobPath: string
  bucket: string;
  createdAt: number;
  createdByUserId: number;
  ddpInstanceId: number;
  ddpParticipantId: string;
  deletedAt: number;
  deletedByUserId: number;
  fileName: string;
  isVirusFree: boolean;
  mimeType: string;
  participantId: number;
  sentAt: number;
  somaticDocumentId: number;
}
