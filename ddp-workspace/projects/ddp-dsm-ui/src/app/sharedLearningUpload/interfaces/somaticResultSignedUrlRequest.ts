export interface SomaticResultSignedUrlRequest {
  fileName: string;
  mimeType: string;
  fileSize: number;
}

export interface SomaticResultSignedUrlResponse {
  authorizeResultType: string;
  fileUploadSettings: {
    allowedFileExtensions: string[];
    maxFileSize: number;
    supportedSomaticFileTypes: string[];
  };
  signedUrl: string;
  somaticResultUpload: {
    blobPath: string;
    bucket: string;
    createdAt: number;
    createdByUserId: number;
    ddpInstanceId: number;
    ddpParticipantId: string;
    deletedAt: number;
    deletedByUserId: number;
    fileName: number;
    isVirusFree: boolean;
    mimeType: string;
    participantId: number;
    sentAt: number;
    somaticDocumentId: number
  }

}
