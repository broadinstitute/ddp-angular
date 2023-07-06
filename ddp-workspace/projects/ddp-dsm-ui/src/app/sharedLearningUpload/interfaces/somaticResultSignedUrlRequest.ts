import {SomaticResultsFile} from './somaticResultsFile';

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
  somaticResultUpload: SomaticResultsFile;
}
