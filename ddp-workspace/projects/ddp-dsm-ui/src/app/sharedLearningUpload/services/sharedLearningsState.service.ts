import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {SomaticResultsFile, SomaticResultsFileWithStatus} from "../interfaces/somaticResultsFile";
import {SharedLearningsHTTPService} from "./sharedLearningsHTTP.service";

@Injectable()
export class SharedLearningsStateService {
  private readonly somaticResultsFilesSubject$ = new Subject<SomaticResultsFileWithStatus[]>();
  public readonly somaticResultsFiles$ = this.somaticResultsFilesSubject$.asObservable();

  constructor(private readonly httpService: SharedLearningsHTTPService) {}

  public getSomaticResultsFiles(participantID: string): Observable<SomaticResultsFile[]> {
    return this.httpService.getFiles(participantID);
  }

  public updateState(updatedState: SomaticResultsFileWithStatus[]): void {
    this.somaticResultsFilesSubject$.next(updatedState);
  }

}
