import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  delay,
  mergeMap,
  Observable,
  repeatWhen,
  Subject,
  takeUntil,
  takeWhile,
  tap,
  throwError
} from 'rxjs';
import {
  SomaticResultsFile, SomaticResultsFileDeleteStatus,
  SomaticResultsFileSendToParticipantStatus,
  SomaticResultsFileWithStatus
} from '../interfaces/somaticResultsFile';
import {SharedLearningsHTTPService} from './sharedLearningsHTTP.service';
import {HttpRequestStatusEnum} from '../enums/httpRequestStatus-enum';
import {catchError, finalize, map} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {SomaticResultsFileVirusStatusEnum} from '../enums/somaticResultsFileVirusStatus-enum';

@Injectable()
export class SharedLearningsStateService {
  private isScanningForViruses = false;
  private readonly somaticResultsFilesSubject$ = new BehaviorSubject<SomaticResultsFileWithStatus[]>([]);
  private takeUntilSubject$ = new Subject<void>();

  public readonly somaticResultsFiles$ = this.somaticResultsFilesSubject$.asObservable();

  constructor(private readonly sharedLearningsHTTPService: SharedLearningsHTTPService) {}

  /* Unsubscription */
  public unsubscribe(): void {
    this.takeUntilSubject$.next();
    this.takeUntilSubject$.complete();
  }

  /* Event Listeners */
  public getAndScanFiles(participantID: string): Observable<any> {
    this.isScanningForViruses = true;
    return this.getFiles(participantID)
      .pipe(
        tap((somaticResultsFilesWithStatus: SomaticResultsFileWithStatus[]) =>
          this.updateState(somaticResultsFilesWithStatus)),
        repeatWhen((notifications: Observable<void>) =>
          notifications.pipe(
            takeWhile(() =>
              this.latestValue
                .some(file => file.virusStatus === SomaticResultsFileVirusStatusEnum.SCANNING)),
            delay(3000)
          )),
        finalize(() => this.isScanningForViruses = false)
      );
  }

  public addFile(somaticResultsFiles: SomaticResultsFile, participantID: string): void {
    this.handleUploadedFile(somaticResultsFiles);
    if(!this.isScanningForViruses) {
      this.getAndScanFiles(participantID)
        .pipe(takeUntil(this.takeUntilSubject$))
        .subscribe();
    }
  }

  public sendFileToParticipant(participantID: string, somaticDocumentId: number): Observable<any> {
    const updatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null);
    this.updateState(updatedState);

    return this.sharedLearningsHTTPService.sendToParticipant(participantID, somaticDocumentId)
      .pipe(
        mergeMap(() => this.sharedLearningsHTTPService
          .getFile(participantID, somaticDocumentId)
          .pipe(catchError((error: any) => {
            if(error instanceof HttpErrorResponse) {
              this.handleSentDateUpdate(somaticDocumentId, null);
              this.handleSendToSuccess(somaticDocumentId);
            }
            return throwError(null);
          }))),
        tap(({sentAt}: SomaticResultsFile) => {
          this.handleSentDateUpdate(somaticDocumentId, sentAt);
          this.handleSendToSuccess(somaticDocumentId);
        }),
        catchError((error: any) => {
          error !== null &&
          error instanceof HttpErrorResponse
          && this.handleSendToFail(somaticDocumentId, error.error);

          return throwError(() => error);
        })
      );
  }

  public deleteFile(somaticDocumentId: number): Observable<any> {
    return this.handleFileDeletion(somaticDocumentId);
  }

  /* Fetching and mapping statuses to documents */

  private getFiles(participantID: string): Observable<SomaticResultsFileWithStatus[]> {
    return this.sharedLearningsHTTPService.getFiles(participantID)
      .pipe(
        map((somaticResultsFiles: SomaticResultsFile[]) => this.filterDeletedFiles(somaticResultsFiles)),
        map((somaticResultsFiles: SomaticResultsFile[]) =>
          somaticResultsFiles.map((somaticResultsFile: SomaticResultsFile) => this.mapStatusesToFile(somaticResultsFile)))
      );
  }

  /* Mappers */
  private mapStatusesToFile(somaticResultsFile: SomaticResultsFile): SomaticResultsFileWithStatus {
    return {
      ...somaticResultsFile,
      createdAt: somaticResultsFile.createdAt * 1000,
      deletedAt: somaticResultsFile.deletedAt * 1000,
      sendToParticipantStatus: this.latestSendToParticipantStatus(somaticResultsFile.somaticDocumentId),
      deleteStatus: this.latestDeleteStatus(somaticResultsFile.somaticDocumentId),
      virusStatus: this.handleVirusStatusFor(somaticResultsFile)
    };
  }

  private latestSendToParticipantStatus(documentID: number): SomaticResultsFileSendToParticipantStatus {
    const somaticDocument: SomaticResultsFileWithStatus = this.latestValue
      .find(({somaticDocumentId}: SomaticResultsFileWithStatus) => somaticDocumentId === documentID);

    return somaticDocument && somaticDocument.sendToParticipantStatus?.status !== HttpRequestStatusEnum.NONE ?
      somaticDocument.sendToParticipantStatus :
      {status: HttpRequestStatusEnum.NONE, message: null};
  }

  private latestDeleteStatus(documentID: number): SomaticResultsFileDeleteStatus {
    const somaticDocument: SomaticResultsFileWithStatus = this.latestValue
      .find(({somaticDocumentId}: SomaticResultsFileWithStatus) => somaticDocumentId === documentID);

    return somaticDocument && somaticDocument.deleteStatus?.status !== HttpRequestStatusEnum.NONE ?
      somaticDocument.deleteStatus :
      {status: HttpRequestStatusEnum.NONE, message: null};
  }

  /* Filter functions */
  private filterDeletedFiles(somaticResultsFiles: SomaticResultsFile[]): SomaticResultsFile[] {
    return somaticResultsFiles.filter((somaticFile: SomaticResultsFile) => !(!!somaticFile.deletedByUserId));
  }


  /** Handlers */
  private handleVirusStatusFor({isVirusFree, deletedAt}: SomaticResultsFile): SomaticResultsFileVirusStatusEnum {
    const isFileDeleted = !!deletedAt;

    if (!isVirusFree && isFileDeleted) { // file has been scanned and is infected
      return SomaticResultsFileVirusStatusEnum.INFECTED;
    } else if (!isVirusFree && !isFileDeleted) {
      // file is being scanned
      return SomaticResultsFileVirusStatusEnum.SCANNING;
    } else if (isVirusFree && !isFileDeleted) { // file has already been scanned for viruses and is clean
      return SomaticResultsFileVirusStatusEnum.CLEAN;
    } else {
      // file has been cleaned and it's deleted
      return SomaticResultsFileVirusStatusEnum.CLEAN;
    }
  }

  private handleFileDeletion(somaticDocumentId: number): Observable<any> {
    const updatedState = this.updateDeleteStatus(somaticDocumentId, HttpRequestStatusEnum.IN_PROGRESS, null);
    this.updateState(updatedState);

    return this.sharedLearningsHTTPService.delete(somaticDocumentId)
      .pipe(
        tap(() => this.handleDeleteSuccess(somaticDocumentId)),
        catchError((error: any) => {
          error instanceof HttpErrorResponse && this.handleDeleteFail(somaticDocumentId, error.error);
          return throwError(() => error);
        })
      );
  }

  private handleUploadedFile(somaticResultsFile: SomaticResultsFile): void {
    const updatedState = [...this.latestValue, this.mapStatusesToFile(somaticResultsFile)];
    this.updateState(updatedState);
  }

  private handleSendToSuccess(somaticDocumentId: number): void {
    const updatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.SUCCESS, null);
    this.updateState(updatedState);

    // Resetting back to send icon, as the file can be sent multiple times
    setTimeout(() => {
      const reUpdatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.NONE, null);
      this.updateState(reUpdatedState);
    }, 2000);
  }

  private handleDeleteSuccess(somaticDocumentId: number): void {
    const updatedState = this.latestValue.filter(({somaticDocumentId: id}) => id !== somaticDocumentId);
    this.updateState(updatedState);
  }

  private handleSendToFail(somaticDocumentId: number, error: string): void {
    const updatedState = this.updateSendToStatus(somaticDocumentId, HttpRequestStatusEnum.FAIL, error);
    this.updateState(updatedState);
  }

  private handleDeleteFail(somaticDocumentId: number, error: string): void {
    const updatedState = this.updateDeleteStatus(somaticDocumentId, HttpRequestStatusEnum.FAIL, error);
    this.updateState(updatedState);
  }

  private handleSentDateUpdate(id: number, sentDate: number | null): void {
    const updatedState = this.updateSentDate(id, sentDate);
    this.updateState(updatedState);
  }




  /** Actions */
  private updateSendToStatus(id: number, status: HttpRequestStatusEnum, message): SomaticResultsFileWithStatus[] {
    return this.latestValue.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {
        ...sharedLearning,
        sendToParticipantStatus: {status, message}
      } : sharedLearning);
  }

  private updateDeleteStatus(id: number,
                             status: HttpRequestStatusEnum.NONE | HttpRequestStatusEnum.IN_PROGRESS | HttpRequestStatusEnum.FAIL,
                             message): SomaticResultsFileWithStatus[] {
    return this.latestValue.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, deleteStatus: {status, message}} : sharedLearning);
  }

  private updateVirusStatus(id: number, virusStatus: SomaticResultsFileVirusStatusEnum):
    SomaticResultsFileWithStatus[] {
    return this.latestValue.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, virusStatus} : sharedLearning);
  }

  private updateSentDate(id: number, sentDate: number): SomaticResultsFileWithStatus[] {
    return this.latestValue.map((sharedLearning: SomaticResultsFileWithStatus) =>
      sharedLearning.somaticDocumentId === id ? {...sharedLearning, sentAt: sentDate} : sharedLearning);
  }

  private updateState(updatedState: SomaticResultsFileWithStatus[]): void {
    this.somaticResultsFilesSubject$.next(updatedState);
  }

  private get latestValue(): SomaticResultsFileWithStatus[] {
    return this.somaticResultsFilesSubject$.getValue();
  }

}
