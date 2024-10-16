import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SomaticResultsFile} from '../interfaces/somaticResultsFile';
import {DSMService} from '../../services/dsm.service';
import {
  SomaticResultSignedUrlRequest,
  SomaticResultSignedUrlResponse
} from '../interfaces/somaticResultSignedUrlRequest';
import {SessionService} from '../../services/session.service';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class SharedLearningsHTTPService {

  constructor(
    private readonly dsmService: DSMService,
    private readonly sessionService: SessionService
  ) {}

  public getFiles(participantId: string): Observable<SomaticResultsFile[]> {
    return this.dsmService.getSomaticResultsFiles(this.selectedRealm, participantId);
  }

  public getFile(participantId: string, somaticDocumentId: number): Observable<SomaticResultsFile> {
    return this.dsmService.getSomaticResultsFile(this.selectedRealm, participantId, somaticDocumentId);
  }

  public getSignedUrl({name, type, size}: File, participantId: string): Observable<SomaticResultSignedUrlResponse> {
    const fileInformation: SomaticResultSignedUrlRequest = {
      fileName: name,
      mimeType: type,
      fileSize: size
    };
    return this.dsmService.getSomaticResultsFileUploadSignedUrl(this.selectedRealm, participantId, fileInformation);
  }

  public upload(signedUrl: string, file: File, headers?: HttpHeaders): Observable<any> {
    this.dsmService.logToCloud(`Uploading file ${file.name} to url ${signedUrl}.`).subscribe({
      error: err => {
        console.error('error logging upload ' + err);
      }
    });
    return this.dsmService.uploadSomaticResultsFile(signedUrl, file, headers);
  }

  public sendToParticipant(participantId: string, somaticDocumentId: number): Observable<object> {
    return this.dsmService.sendSomaticResultsToParticipant(this.selectedRealm, {
      participantId,
      somaticDocumentId
    });
  }

  public delete(somaticDocumentId: number): Observable<SomaticResultsFile> {
    return this.dsmService.deleteSomaticResultsFile(this.selectedRealm, somaticDocumentId);
  }

  private get selectedRealm(): string {
    return this.sessionService.selectedRealm;
  }

}
