import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SomaticResultsFile} from '../interfaces/somaticResultsFile';
import {DSMService} from '../../services/dsm.service';
import {ComponentService} from '../../services/component.service';
import {
  SomaticResultSignedUrlRequest,
  SomaticResultSignedUrlResponse
} from '../interfaces/somaticResultSignedUrlRequest';

@Injectable()
export class SharedLearningsHTTPService {

  constructor(private readonly dsmService: DSMService) {
  }

  public getFiles(participantId: string): Observable<SomaticResultsFile[]> {
    return this.dsmService.getSomaticResults(this.selectedRealm, participantId);
  }

  public getSignedUrl({name, type, size}: File, participantId: string): Observable<SomaticResultSignedUrlResponse> {
    const fileInformation: SomaticResultSignedUrlRequest = {
      fileName: name,
      mimeType: type,
      fileSize: size
    };
    return this.dsmService.getSomaticResultFileUploadSignedUrl(this.selectedRealm, participantId, fileInformation);
  }

  public upload(signedUrl: string, file: File): Observable<any> {
    return this.dsmService.uploadSomaticResult(signedUrl, file);
  }

  public delete(somaticDocumentId: number): Observable<any> {
    return this.dsmService.deleteSomaticResult(this.selectedRealm, somaticDocumentId);
  }

  private get selectedRealm(): string {
    return sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }

}
