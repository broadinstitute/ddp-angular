import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SomaticResultsFile} from '../interfaces/somaticResultsFile';
import {DSMService} from '../../services/dsm.service';
import {
  SomaticResultSignedUrlRequest,
  SomaticResultSignedUrlResponse
} from '../interfaces/somaticResultSignedUrlRequest';
import {SessionService} from '../../services/session.service';
import {map} from "rxjs/operators";

@Injectable()
export class SharedLearningsHTTPService {

  constructor(
    private readonly dsmService: DSMService,
    private readonly sessionService: SessionService) {
  }

  public getFiles(participantId: string): Observable<SomaticResultsFile[]> {
    return this.dsmService.getSomaticResultsFiles(this.selectedRealm, participantId)
      // @TODO remove when backend fixed
      .pipe(map((somaticResults: SomaticResultsFile[]) => {
        return somaticResults.map((file: SomaticResultsFile) => {
          file.isVirusFree = true;
          file.deletedAt = 0;
          return file;
        })
      }));
  }

  public getFile(participantId: string, somaticDocumentId: number) : Observable<SomaticResultsFile> {
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

  public upload(signedUrl: string, file: File): Observable<any> {
    return this.dsmService.uploadSomaticResultsFile(signedUrl, file);
  }

  public sendToParticipant(participantId: string, somaticDocumentId: number): Observable<any> {
    return this.dsmService.sendSomaticResultsToParticipant(this.selectedRealm, {
      participantId,
      somaticDocumentId
    });
  }

  public delete(somaticDocumentId: number): Observable<any> {
    return this.dsmService.deleteSomaticResultsFile(this.selectedRealm, somaticDocumentId);
  }

  private get selectedRealm(): string {
    return this.sessionService.selectedRealm;
  }

}
