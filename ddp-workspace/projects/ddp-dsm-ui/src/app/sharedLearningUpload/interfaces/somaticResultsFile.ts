import {HttpRequestStatusEnum} from '../enums/httpRequestStatus-enum';
import {SomaticResultsFileVirusStatusEnum} from '../enums/somaticResultsFileVirusStatus-enum';

export interface SomaticResultsFile {
  blobPath: string;
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

export interface SomaticResultsFileWithStatus extends SomaticResultsFile {
  isInfected: SomaticResultsFileVirusStatusEnum;
  sendToParticipantStatus: {
    status: HttpRequestStatusEnum;
    message: string | null;
  };
  deleteStatus: {
    status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL;
    message: string | null;
  };
}
