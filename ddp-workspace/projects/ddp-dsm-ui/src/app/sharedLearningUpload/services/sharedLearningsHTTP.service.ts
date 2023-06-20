import {Injectable} from "@angular/core";
import {delay, mergeMap, Observable, of, pipe, switchMap} from "rxjs";
import {SharedLearningsFile} from "../interfaces/sharedLearningsFile";
import {DSMService} from "../../services/dsm.service";
import {ComponentService} from "../../services/component.service";
import {catchError, map} from "rxjs/operators";
import {SomaticResultSignedUrl} from "../interfaces/somaticResultSignedUrl";

@Injectable()
export class SharedLearningsHTTPService {

  constructor(private readonly dsmService: DSMService) {
  }

  public getFiles(participantId: string): Observable<SharedLearningsFile[]> {
    return this.dsmService.getSomaticResults(this.selectedRealm, participantId)
      // @TODO mocked data
      .pipe(map(() => [
        {name: 'some.pdf', sentDate: new Date(), uploadDate: new Date(), id: 123},
        {name: 'other.pdf', sentDate: new Date(), uploadDate: new Date(), id: 124},
        {name: 'several.pdf', sentDate: new Date(), uploadDate: new Date(), id: 125},
      ]))
  }

  public uploadFile(participantId: string, file: File): Observable<any> {
    const fileInformation: SomaticResultSignedUrl = {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size
    }
    return this.dsmService.getSomaticResultFileUploadSignedUrl(
      this.selectedRealm,
      participantId,
      fileInformation
    ).pipe(
      mergeMap((signedUrl: string) => this.dsmService.uploadSomaticResult(signedUrl, file)),
      // @TODO mocked response
      catchError(() => of({name: 'several.pdf', sentDate: new Date(), uploadDate: new Date(), id: Math.floor(Math.random() * 124)}))
    )
  }

  private get selectedRealm(): string {
    return sessionStorage.getItem(ComponentService.MENU_SELECTED_REALM);
  }

}
