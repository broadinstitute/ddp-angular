import {Injectable} from "@angular/core";
import {delay, Observable, of, pipe, switchMap} from "rxjs";
import {SharedLearningsFile} from "../interfaces/sharedLearningsFile";
import {DSMService} from "../../services/dsm.service";
import {ComponentService} from "../../services/component.service";
import {catchError} from "rxjs/operators";
import {SomaticResultSignedUrl} from "../interfaces/somaticResultSignedUrl";

@Injectable()
export class SharedLearningsHTTPService {

  constructor(private readonly dsmService: DSMService) {
  }

  public getFiles(participantId: string): Observable<SharedLearningsFile[]> {
    return this.dsmService.getSomaticResults(sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM), participantId)
      // @TODO it's mocked data
      .pipe(catchError(() => of([
        {name: 'some.pdf', uploadDate: '02/01/2023', sentDate: '09/19/2023'}
      ])));
  }

  public uploadFile(participantId: string, file: File): Observable<any> {
    const fileInformation: SomaticResultSignedUrl = {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size
    }
    return this.dsmService.getSomaticResultFileUploadSignedUrl(
      sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM),
      participantId,
      fileInformation
    ).pipe(
      switchMap((signedUrl: string) => this.dsmService.uploadSomaticResult(signedUrl, file))
    )
  }

}
